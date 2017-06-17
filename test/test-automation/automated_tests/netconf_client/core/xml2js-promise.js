/*
 * Copyright (C) 2016 Deutsche Telekom AG
 *
 * Author: Mak Krnic <mak.krnic@sartura.hr>
 *
 * testconf is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * You should have received a copy of the GNU General Public License
 * along with testconf. If not, see <http://www.gnu.org/licenses/>.
 */

var xml2js = require('xml2js')
var Promise = require('promise')

module.exports.parseString = function(input)
{
	return new Promise(function(resolve, reject)
	{
		var parser = new xml2js.Parser()

		parser.parseString(input, function(error, data)
		{
			if (error)
			{
				reject(error)
			}
			else
			{
				resolve(data)
			}
		})
	})
}
