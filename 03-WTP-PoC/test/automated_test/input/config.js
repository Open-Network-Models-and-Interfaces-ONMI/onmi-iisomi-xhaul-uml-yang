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

var config = {}
module.exports = config
config.netconf = {}
config.netconf.host = '172.17.0.2'
config.netconf.port = 830
config.netconf.user = 'root'
config.netconf.pass = 'root'

config.client = {}
config.client.log_name = __dirname + "/logs/client.log"


