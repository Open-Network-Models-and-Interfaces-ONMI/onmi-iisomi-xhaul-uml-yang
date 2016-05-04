import requests, sys, os, time, json
import xml.etree.ElementTree as ET

odlIP='127.0.0.1'
odlPort='8181'
odlUsername='admin'
odlPassword='admin'


currentPath = os.path.dirname(os.path.realpath(__file__))
configDir=currentPath + "/netconf-servers"
operation=""

if len(sys.argv) <= 1:
	print("Usage:")
	print("python " + __file__ +" [add/delete]")
	sys.exit(1)
else:
	operation = sys.argv[1]

for configFile in os.listdir(configDir):
	status = ""
	configFile = configDir + "/" + configFile

	try:
		tree = ET.parse(configFile)
		root = tree.getroot()

		name = root.find('{urn:opendaylight:params:xml:ns:yang:controller:config}name').text

		if operation == "add":

			url = 'http://{}:{}/restconf/config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules'.format(odlIP, odlPort)
			headers = {
					    'content-type': "application/xml",
					    'cache-control': "no-cache"
				      }		

			with open(configFile,'rb') as configFileContent:
				payload = configFileContent.read()
				response = requests.request("POST", url, data=payload, headers=headers, auth=(odlUsername, odlPassword))

			if response.status_code == 204:
				status = 0
			else:
				print(json.dumps(json.loads(response.text), indent=4))
				status = 1

		elif operation == "delete":
			url = "http://{}:{}/restconf/config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules/module/odl-sal-netconf-connector-cfg:sal-netconf-connector/{}".format(odlIP, odlPort, name)
			headers = {
					    'content-type': "application/xml",
					    'cache-control': "no-cache"
				      }		
			response = requests.request("DELETE", url, headers=headers, auth=('admin', 'admin'))

			if response.status_code == 200:
				status = 0
			else:
				print(json.dumps(json.loads(response.text), indent=4))
				status = 1

		else:
			print("Unknown option " + operation)
			sys.exit(1)


		if status ==  0:
			print("Succeeded to " + operation + " " + name)

			# if operation == 'add':
			# 	time.sleep(1)
			# 	url = "http://{}:{}/restconf/operational/opendaylight-inventory:nodes/node/{}/yang-ext:mount/SimpleAirInterface-ObjectClasses:AirInterface".format(odlIP, odlPort, name)
			# 	response = requests.request("GET", url, headers=headers, auth=('admin', 'admin'))

			# 	print json.dumps(json.loads(response.text), indent=4)

		else:
			print("Faild to " + operation + " " + name)

	except Exception as e:
		print("OS error: {0}".format(e))
		print("Failed for " + configFile)
