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

var net = require('net');
var config = require('./config')
var fs = require('fs')

exports.write = function(msg, to_console, to_file)
{
	if (!msg)
		return

	if (to_console)
		//console.log(msg)

	fs.write(to_file, msg + require('os').EOL, null, 'utf8', function(error, written)
	{
		if (error)
		{
			//console.error(error)
			//process.exit(1)
		}
	})
}
