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

var path = require("path")
var fs = require('fs')
var debug = require('./debug')

// netconf base 1.0 and base 1.1 ending
var netconf_ending = [ "]]>]]>", "\n##\n" ]

var xml_prologue = '<?xml version="1.0" encoding="UTF-8"?>'

var netconf_hello_header =
	xml_prologue + '<hello xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">'

var netconf_capabilities =
		'<capability>urn:ietf:params:netconf:base:1.0</capability>' +
		'<capability>urn:ietf:params:netconf:base:1.1</capability>' +
		'<capability>urn:ietf:params:netconf:capability:writable-running:1.0</capability>' +
		'<capability>urn:ietf:params:xml:ns:yang:ietf-netconf-monitoring?module=ietf-netconf-monitoring&amp;revision=2010-10-04</capability>'

var netconf_hello_ending = '</hello>' + netconf_ending[0]

var netconf_rpc_end = '</rpc>'
var netconf_rpc_reply_end = '</rpc-reply>'

var rpc_error_tag = []
rpc_error_tag.push("in-use")
rpc_error_tag.push("invalid-value")
rpc_error_tag.push("operation-not-supported")
rpc_error_tag.push("operation-failed")
rpc_error_tag.push("data-missing")


exports.hello = function(capabilities, session_id)
{
	capabilities = capabilities || ''

	var session_id_xml = session_id ? "<session-id>" + session_id + "</session-id>" : ""

	return netconf_hello_header +
		"<capabilities>" +
			netconf_capabilities +
			capabilities +
		"</capabilities>" +
		session_id_xml +
		netconf_hello_ending
}

exports.get = function(filter)
{
	return "<get />"
}

exports.get_config = function(filter)
{
	return "<get-config />"
}

exports.kill = function(session_id)
{
	var session_id_xml = session-id ? "<session-id>" + session_id + "</session-id>" : ""

	return "<kill-session>" + session_id_xml + "</kill-session>"
}

exports.close = function()
{
	return "<close-session />"
}

var netconf_rpc_header = exports.rpc_header = function(base, message_id)
{
	base = base || 0
	message_id = message_id || 1

	return '<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0' + '" message-id="'+ message_id + '">'
}

var netconf_rpc_reply_header = exports.rpc_reply_header = function(base, message_id)
{
	base = base || 0
	message_id = message_id || 1

	return '<rpc-reply xmlns="urn:ietf:params:xml:ns:netconf:base:1.0' + '" message-id="'+ message_id + '">'
}

exports.get_schema = function(schema)
{
	var schema_xml = '<get-schema xmlns="urn:ietf:params:xml:ns:yang:ietf-netconf-monitoring">'

	schema_xml += "<identifier>" + schema.identifier + "</identifier>"
	schema_xml += "<format>" + (("format" in schema) ? schema.format : "yang") + "</format>"
	schema_xml += ("version" in schema) ? "<version>" + schema.version + "</version>" : ""

	schema_xml += '</get-schema>'

	return schema_xml
}

exports.rpc_end = netconf_rpc_end
exports.rpc_reply_end = netconf_rpc_reply_end
exports.ending = netconf_ending

exports.process_message = function(connection, callback)
{
	var request = null
	while (connection.buffer.indexOf(netconf_ending[connection.netconf_base]) !== -1) {

		// get message without ending
		var end = connection.buffer.indexOf(netconf_ending[connection.netconf_base])
		var request = connection.buffer.substr(0, end)

		// and remove it from buffer
		connection.buffer = connection.buffer.substr(end + netconf_ending[connection.netconf_base].length)

		// get message length
		if (connection.netconf_base == 1)
		{
			var framing_chunk = request.match(/[0-9]+/)
			request = request.replace(/\n.*#[0-9]+\n/, '')
		}

		// callback with message
		request && callback && callback(request)
	}
}

var create_framing_chunk = exports.create_framing_chunk = function(message_length)
{
	message_length = message_length || 0

	return "\n#" + message_length + "\n"
}

exports.create_rpc_message = function(message, base, message_id)
{
	if (!message)
		return

	base = base || 0

	var r_message = netconf_rpc_header(base, message_id) + message + netconf_rpc_end + netconf_ending[base]

	return (base == 1 ? create_framing_chunk(r_message.length - netconf_ending[base].length) + r_message : r_message)
}

exports.create_rpc_reply_message = function(message, base, message_id)
{
	if (!message)
		return

	base = base || 0

	var r_message = netconf_rpc_reply_header(base, message_id) + message + netconf_rpc_reply_end + netconf_ending[base]

	return (base == 1 ? create_framing_chunk(r_message.length - netconf_ending[base].length) + r_message : r_message)
}

exports.capabilities_from_yang = function(yang_dir, to_file)
{
	var capabilities = ''
	var files = fs.readdirSync(yang_dir)

	if (!files)
		return capabilities

	files.forEach(function(file)
	{
		debug.write('... ' + file, true, to_file);

		file = path.basename(file, '.yang')

		var parts = file.split("@")
		if (!parts.length)
			return

		var capability = '<capability>urn:ietf:params:xml:ns:yang:'
		capability += parts[0] + "?module=" + parts[0]
		if (typeof parts[1] !== 'undefined')
			capability += "&amp;revision=" + parts[1]

		capability += "</capability>"

		capabilities += capability
	})

	return capabilities
}

exports.rpc_error = function(msg, tag, type, severity)
{
	var rpc_error = { 'rpc-error' : {}}
	rpc_error["rpc-error"]["error-type"] = type || "rpc"
	rpc_error["rpc-error"]["error-tag"] = tag || "operation-failed"
	rpc_error["rpc-error"]["error-severity"] = severity || "error"
	rpc_error["rpc-error"]["error-message"] =  {'$' : {'xml:lang' : 'en'} , '_' : (msg || "")  }

	if (rpc_error_tag.filter(function(e)
	{
		if (e == rpc_error["rpc-error"]["error-tag"])
			return e

	}).length == 0)
	{
		console.error('rpc-error: tag must be one of:')
		console.error(rpc_error_tag)
		process.exit(1)
	}

	return rpc_error
}

exports.create_default_methods = function()
{
	var methods = {}
	methods["get"] = {}
	methods["get-config"] = {}
	methods["edit-config"] = {}

	return methods
}

exports.add_method = function(methods, path, method)
{
	methods = methods || {}
	methods["paths"] = methods["paths"] || []
	methods["paths"].push({path : path, method : method})
}
