/*
 * Copyright (C) 2014 Cisco Systems, Inc.
 *
 * Author: Petar Koretic <petar.koretic@sartura.hr>
 * Author: Luka Perkov <luka.perkov@sartura.hr>
 *
 * testconf is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * You should have received a copy of the GNU General Public License
 * along with testconf. If not, see <http://www.gnu.org/licenses/>.
 */

var fs = require('fs');
var ssh2 = require('ssh2')
var events = require("events")
var util = require('util')
var path = require('path')
var Promise = require('promise')

var xml2js = require('./core/xml2js-promise')
var netconf = require('./core/netconf')
var debug = require('./core/debug')
var config = require('./core/config')

var client = function(options)
{
	var opts = options || {}
	this.name = opts.name || path.basename(module.parent.filename)
	this.host = opts.host || config.netconf.host
	this.port = opts.port || config.netconf.port
	this.user = opts.user || config.netconf.user
	this.pass = opts.pass || config.netconf.pass
	//this.log_name = opts.log_name || config.client.log_name
	this.capabilities = opts.capabilities || []
	this.ssh_key = opts.ssh_key || null
	this.send_hello_message = opts.send_hello_message || true

	var self = this

	this.buffer = ''
	this.netconf_base = 0

	var message_id = 1
	var messages_queue = []

	var netconf_ready = false;

	events.EventEmitter.call(this);

	//self.log_file = fs.openSync(self.log_name, "a+")

	/*if (!self.log_file)
	{
		var err_msg = "unable to create log file: '" + self.log_name + "'"
		console.error(err_msg)

		return Promise.reject(err_msg)
	}*/

	//debug.write('. executing test named "' + this.name + '"', true, self.log_file)

	try
	{
		self.rpc_methods = require(config.server_methods_dir + "core.js")
	}
	catch(e)
	{
		//debug.write(e, true, self.log_file)
	}

	var ssh = new ssh2();
	var ssh_opts = {}
	var con = null

	var log_file = null

	ssh_opts.host = self.host
	ssh_opts.port = self.port

	if (self.ssh_key)
	{
		ssh_opts.ssh_key = self.ssh_key
	}
	else
	{
		ssh_opts.username = self.user
		ssh_opts.password = self.pass
	}

	var processRequest = function(resolve, reject)
	{
		return function (request)
		{
			//debug.write('<<<< msg netconf <<<<', false, self.log_file)
			//debug.write(request, false, self.log_file)
			//debug.write('---- msg netconf ----', false, self.log_file)

			xml2js.parseString(request).then(function(data)
			{
				if (data["hello"])
				{
					if (netconf_ready)
					{
						//debug.write('..... hello received at the wrong stage', true, self.log_file)
						return reject('hello received at the wrong stage')
					}

					//debug.write('..... hello', true, self.log_file)
					netconf_ready = 1

					var capabilities = data["hello"]["capabilities"][0].capability;

					for (var i in capabilities)
					{
						//debug.write('...... capability - ' + capabilities[i], true, self.log_file)

						if (capabilities[i] == 'urn:ietf:params:netconf:base:1.1')
						{
							self.netconf_base = 1;
						}
					}

					resolve(self)
					return
				}

				if (data["rpc-reply"])
				{
					var msg_id = data["rpc-reply"].$["message-id"]
					if (typeof messages_queue[msg_id] === 'undefined')
					{
						//debug.write('..... rpc-reply with incorrect message id', true, self.log_file)
						return reject("rpc-reply with incorrect message id")
					}

					//debug.write('..... rpc-reply', true, self.log_file)

					messages_queue[msg_id](request)
					delete messages_queue[msg_id]
				}
			},
			function(error)
			{
				//debug.write('.... xml parsing failed', true, self.log_file)
				//debug.write(error, false, self.log_file)

				return reject(error)
			})
		}
	}


	var startSshClientSession = function(ssh_opts)
	{
		return new Promise(function(resolve, reject)
		{
			ssh.connect(ssh_opts);

			ssh.on('ready', function()
			{
				//debug.write('.. ssh connection ready', true, self.log_file)

				ssh.subsys('netconf', function(error, stream)
				{
					if (error)
					{
						ssh.end()
						return reject && reject(error)
					}

					con = stream

					//debug.write('... netconf subsystem acquired', true, self.log_file)

					if (self.send_hello_message)
					{
						//debug.write('.... sending client hello', true, self.log_file)
						//debug.write('>>>> msg netconf hello >>>>', false, self.log_file)
						//debug.write(netconf.hello(self.capabilities), false, self.log_file)
						//debug.write('---- msg netconf hello ----', false, self.log_file)

						stream.write(netconf.hello(self.capabilities));
					}

					stream.on('error', function(error)
					{
						//debug.write('.. ssh stream close', true, self.log_file)
						ssh.end()
						return reject && reject(error)
					})

					stream.on('close', function()
					{
						//debug.write('.. ssh stream close', true, self.log_file)
						ssh.end();
					});

					stream.on('data', function(data, extended)
					{
						//debug.write('.... received (partial) msg, len: ' + data.toString().length, false, self.log_file)
						//debug.write('<<<< partial msg <<<<', false, self.log_file)
						//debug.write(data.toString(), false, self.log_file)
						//debug.write('---- partial msg ----', false, self.log_file)

						self.buffer += data.toString();

						//debug.write('.... processing incoming request', true, self.log_file)
						netconf.process_message(self, processRequest(resolve, reject))
					})
				})
			})

			ssh.on('error', function(error)
			{
				if (!netconf_ready)
				{
					return reject && reject(error)
				}

				//debug.write('.. ssh connection closed due to error', true, self.log_file)
				//debug.write(error, false, self.log_file)
				fs.closeSync(self.log_file);
				return reject && reject(error)
			})

			ssh.on('close', function(had_error)
			{
				//debug.write('.. ssh connection closed', true, self.log_file)
				fs.closeSync(self.log_file);
			});
		})
	}

	this.send = function(message)
	{
		var promise = new Promise(function(resolve, reject)
		{
			if (!con)
			{
				//debug.write('... ssh stream has not been established', true, self.log_file)
				reject && reject('ssh stream has not been established')
			}

			if (!netconf_ready)
			{
				//debug.write('... netconf not ready, hello message has not been exchanged', true, self.log_file)
				reject && reject('netconf not ready, hello message has not been exchanged')
			}

			// create netconf message
			var xml_message = netconf.create_rpc_message(message, self.netconf_base, message_id)

			// add message to global queue
			messages_queue[message_id++] = resolve

			// send message via ssh
			con.write(xml_message);

			//debug.write('>>>> msg netconf >>>>', false, self.log_file)
			//debug.write(xml_message, false, self.log_file)
			//debug.write('---- msg netconf ----', false, self.log_file)
		})

		promise.thenDefault = function(resolve, reject)
		{
			if (typeof resolve === 'undefined')
			{
				resolve = function(success)
				{
					process.exit(0)
				}
			}

			if (typeof reject === 'undefined')
			{
				reject = function(error)
				{
					console.error(error)
					process.exit(1)
				}
			}

			return promise.then(resolve, reject)
		}

		return promise
	}

	// standard netconf rpcs
	this.send_get = function(filter)
	{
		//debug.write('.... sending msg (get)', true, self.log_file)
		return self.send(netconf.get(filter))
	}

	this.send_get_config = function(filter)
	{
		//debug.write('.... sending msg (get-config)', true, self.log_file)
		return self.send(netconf.get_config(filter))
	}

	this.send_close = function()
	{
		//debug.write('.... sending msg (close-session)', true, self.log_file)
		//setBreakpoint().sb()
		return self.send(netconf.close())
	}

	this.send_kill = function(session_id)
	{
		//debug.write('.... sending msg (kill-session)', true, self.log_file)
		return self.send(netconf.kill(session_id))
	}

	this.send_get_schema = function(schema)
	{
		if (!schema || !("identifier" in schema)) {
			return new Promise.reject('missing mandatory argument "identifier" in schema')
		}

		//debug.write('.... sending msg (get-schema)', true, self.log_file)
		return self.send(netconf.get_schema(schema))
	}

	return startSshClientSession(ssh_opts)
}

util.inherits(client, events.EventEmitter);

exports.create = function(opts)
{
	return client(opts)
}
