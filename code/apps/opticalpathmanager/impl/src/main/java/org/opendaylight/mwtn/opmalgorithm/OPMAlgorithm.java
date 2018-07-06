package org.opendaylight.mwtn.opmalgorithm;
/*
 * Copyright (c) 2018 sendate.eu and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */


/**
 * @ original author Dmitry Khomchenko (VPI photonics)
 *
 */

import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;
import java.util.LinkedList;

import java.util.Scanner;

public class OPMAlgorithm {

	public static void main(String[] args)
{
			long startTime = System.currentTimeMillis();

		OptNetwork NetworkGraph = getNetworkData();// builds artificial network, connectivity requests
		long endTime = System.currentTimeMillis();
		long dt = endTime-startTime;
		System.out.println("Get network data time: "+ String.valueOf(dt)+ " ms");

		NetworkGraph.calcLinskWeight();//calculates initial weight
		//NetworkGraph.printEdgeWeight(); // debug info
		//NetworkGraph.PrintNetworkGraph(); // debug info

		for(int i = 0;i < NetworkGraph.tdList.length;i++)
		{
			ConnectivityRequest curTD = NetworkGraph.tdList[i];

			if(curTD.RouteList.isEmpty())// if some TDs routed exist in the network - search for routes for unrouted TDs only
			{
				ArrayList<ArrayList<NetEdge>> graph = curTD.prepareDijkstraGraph(NetworkGraph.edgeList,null);

				LinkedList<Integer> res = NetworkGraph.shortest_path(graph,curTD);

				if (0 < res.size())// primary route exists
				{
					Route resRoute = new Route();
					resRoute = curTD.RouteList.get(curTD.RouteList.size()-1);

					NetworkGraph.calcRouteLengthWeight(resRoute);
					//NetworkGraph.updateIndicesUsedByLinks(resRoute,curTD.Width);

					NetworkGraph.tdList[i].RouteList.set(curTD.RouteList.size()-1,resRoute);// the 1st route with lowest weight

					ArrayList<ArrayList<NetEdge>> tmpLinksToExclude= NetworkGraph.excludeEdgesForAltRoutes(resRoute.RouteByLinks);

			        for (int k = 0; k< tmpLinksToExclude.size(); k++)// here should be the loop over route links to get alternate routes
			        {
						graph = curTD.prepareDijkstraGraph(NetworkGraph.edgeList,tmpLinksToExclude.get(k));//to update weight - to exclude cur route links from alternate route
				//		add here alternate routes, e.g. remove edge assigned from graph and build new route for each edge in original route, so there could be originalRoute.length alternatives
						res = NetworkGraph.shortest_path(graph,curTD);
						if (0 < res.size())//alternate route exists
						{
							Route altRoute = new Route();
							altRoute = curTD.RouteList.get(curTD.RouteList.size()-1);
							NetworkGraph.calcRouteLengthWeight(altRoute);
							//NetworkGraph.updateIndicesUsedByLinks(altRoute);//commented out - avail indices shall not be updated when alternate routes are calculated, because alt route is not a protection for primary, just the alternative
							NetworkGraph.tdList[i].RouteList.set(curTD.RouteList.size()-1,altRoute);
						}
					}
			        NetworkGraph.updateIndicesUsedByLinks(resRoute,curTD.Width);
				}
			}
		}

		//NetworkGraph.printEdgeWeight(); //debugInfo

		for(int i = 0;i < NetworkGraph.tdList.length;i++)
		{
			NetworkGraph.tdList[i].printTDdata();//debug info
		}

		 endTime = System.currentTimeMillis();
         dt = endTime - startTime;
        System.out.println("\nElapsed Time: "+String.valueOf(dt) + " ms.");

        System.out.println("\n\nEnter TD ID for evaluation: ");
        Scanner in = new Scanner(System.in);

        int tdIndex = in.nextInt();
        int routeInd = -1;
        if (tdIndex < NetworkGraph.tdList.length-1)
        {
        	routeInd =0;
        }
        if(routeInd<0)
        {
        	System.out.println("\n\nEnter route ID for evaluation: ");
        	routeInd = in.nextInt();
        }
        in.close();

        NetworkGraph.assessRoute(tdIndex, routeInd);

		System.out.println("\n!---DONE---!");
	}

    public static OptNetwork getNetworkData()// nodes, links, TDs
    {

    	int curNetworkCapacity = 40;//Index Count
    	double gridDF = 12.5;//12.5;//50;//GHz

    	List<NetEdge> CurEdgeList= new ArrayList<NetEdge>();
    	List<NetNode> CurNodeList = new ArrayList<NetNode>();
    	List<ConnectivityRequest> CurTDlist = new ArrayList<ConnectivityRequest>();


		//--------existing optical paths----------------------
		LinkedList<LinkedList<Integer>> ExistingRouteList = new LinkedList<LinkedList<Integer>>();

		// short edges
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(8,0,1,3,11)));//red
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(10,1,2,4,5,13)));//green
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(9,0,2,6,7,4,3,5,12)));//blue
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(8,0,1,10)));//orange

		/*
		 // extended edges (with amps and mdx) should work along with //extension of edges to LTPs defined in topologyInputData.java file
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(52, 53, 54, 0, 1, 2, 3, 4, 5, 6, 18, 19, 20, 21, 22, 23, 63, 62, 61)));//red
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(58, 59, 60, 6, 7, 8, 9, 10, 11, 12, 48, 47, 46, 49, 50, 51, 29, 40, 39, 38, 37, 36, 23, 35, 34, 33, 32, 31, 30, 69, 68, 67)));//green
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(55, 56, 57, 0, 13, 14, 15, 16, 17, 12, 48, 47, 46, 49, 50, 51, 29, 45, 44, 43, 42, 41, 30, 69, 68, 67)));//blue
		*/
		ArrayList<Integer> ExistingRouteIndexList = new ArrayList<Integer>();//Center index, i.e. channel center freq
		ExistingRouteIndexList.add(0);		ExistingRouteIndexList.add(5);		ExistingRouteIndexList.add(10);		ExistingRouteIndexList.add(15);
		ArrayList<Double> ExistingRouteBRlist = new ArrayList<Double>();
		ExistingRouteBRlist.add(112.);		ExistingRouteBRlist.add(112.);		ExistingRouteBRlist.add(112.);		ExistingRouteBRlist.add(112.);
		ArrayList<Double> ExistingRouteSRlist = new ArrayList<Double>();
		ExistingRouteSRlist.add(28.);		ExistingRouteSRlist.add(28.);		ExistingRouteSRlist.add(28.);		ExistingRouteSRlist.add(56.);
		ArrayList<String> ExistingRouteMFlist = new ArrayList<String>();
		ExistingRouteMFlist.add("NA");		ExistingRouteMFlist.add("NA");		ExistingRouteMFlist.add("NA");		ExistingRouteMFlist.add("NA");
		//----------------------------------------------------

    	//String[] InputLinkLabel = {"C0-C1","C1-C2","C0-C2","C1-A1","C2-A2","A0-A1","A1-A2","A0-A2","oeo1-C2","oeo2-A2","oeo1-oeo2"};//,"ETY1-C0","ETY2-C0","ETY3-C1","ETY4-A1","ETY5-A0","ETY6-A0"};
    	String[] InputLinkLabel = {"C0-C1","C1-C2","C0-C2","C1-A1","C2-A2","A0-A1","A1-A2","A0-A2","oeo1-C2","oeo2-A2","oeo1-oeo2","ETY1-C0","ETY2-C0","ETY3-C1","ETY4-A1","ETY5-A0","ETY6-A0","ETY7-C0","ETY8-A0"};

    	//double[] InputLinkLength = {75,80,43,1,1,120,60,63,0,0,0};//,0,0,0,0,0,0};//length-(to do)->data: length, loss(coeff), boost(G,NF), pre(G,NF), capacity// oeo - later, now oeo from label -> 6(7) params in total
    	double[] InputLinkLength = {75,80,43,1,1,120,60,63,0,0,0,0,0,0,0,0,0,0,0};
    	// one link :
    	int inputLinkCapacity = 40;

    	NetworkInputData topologyData = new NetworkInputData(InputLinkLabel,InputLinkLength,inputLinkCapacity);
    	ArrayList<String> linkLabel = topologyData.linkLabel;
    	ArrayList<String> ndLabel = topologyData.ndLabel;
    	double[] linkWeight = topologyData.linkWeight;
    	double[] linkLength = topologyData.linkLength;
    	int[] linkCapacity = topologyData.linkCapacity;
    	int[] srcId = topologyData.srcId;
    	int[] dstId = topologyData.dstId;
    	boolean[] linkOEOstate = topologyData.linkOEOstate;

    	int NetworkLinkCount = linkLabel.size();
    	int NetworkNodeCount = ndLabel.size();

    	//------connectivity requests parameters--------------
		int[] src = {ndLabel.indexOf("ETY7")};//{55,58};//{34};// {0};// {8};// {8,9,10,9};
		int[] dst = {ndLabel.indexOf("ETY8")};//{67,67};//{44};// {5};// {13};// {11,12,13,6};
		double[] BR = {112,112,112,112};//Gbps
		double[] SR = {28,28,28,28};//{28,28,28,28};//{56,56,56,56};//~ equals to GHz
		String[] MF = {"NA","NA","NA","NA"};//modulation format
		//----------------------------------------------------

    	//------------Connectivity Requests constraints--------------
    	ArrayList<ArrayList<Integer>> linksToExclude =new ArrayList<ArrayList<Integer>>();// array of link indices for each TD
    	//linksToExclude.add(new ArrayList<Integer>(Arrays.asList(0,1,14,15)));//for the 1st TD - "C0-C1","C1-C0","A0-A2","A2-A0"
    	linksToExclude.add(new ArrayList<Integer>());//for the 1st TD
    	ArrayList<ArrayList<Integer>> linksToInclude =new ArrayList<ArrayList<Integer>>();// array of link indices for each TD
    	//linksToInclude.add(new ArrayList<Integer>(Arrays.asList(12,13)));//for the 1st TD - "A1-A2","A2-A1"
    	// something bad happens here - everlasting loop in shortest_path!!!!!//fix: replace	curWeight = this.weight; with curWeight = 10.0*Math.log10(Math.pow(10.0,0.1*curNoiseIn)+this.weight);
    	linksToInclude.add(new ArrayList<Integer>());//for the 1st TD

    	// other TDs constraints shall be defined here
    	linksToExclude.add(new ArrayList<Integer>());//for the 2nd TD
    	linksToInclude.add(new ArrayList<Integer>());//for the 2nd TD

    	linksToExclude.add(new ArrayList<Integer>());//for the 3rd TD
    	linksToInclude.add(new ArrayList<Integer>());//for the 3rd TD

    	linksToExclude.add(new ArrayList<Integer>());//for the 4rth TD
    	linksToInclude.add(new ArrayList<Integer>());//for the 4rth TD
    	//------------End of Connectivity Requests constraints-------

    	ArrayList<ArrayList<Integer>> usedIndices =new ArrayList<ArrayList<Integer>>();
    	ArrayList<ArrayList<Integer>> operationalRouteIndices =new ArrayList<ArrayList<Integer>>();//indices of TDs in operational state

    	for(int i = 0; i < NetworkLinkCount; i++)// run through all links in the network
    	{
    		usedIndices.add(new ArrayList<Integer>());//defines used indices for cur link
    		usedIndices.get(usedIndices.size()-1).add(-1);
    		operationalRouteIndices.add(new ArrayList<Integer>());//defines active route indices for cur link

			for(int j = 0; j < ExistingRouteList.size(); j++)//run through all existing routes
			{
				LinkedList<Integer> curExistingRoute =  ExistingRouteList.get(j);
				int curExistingRouteInd = ExistingRouteIndexList.get(j);

				for(int k = 0; k < curExistingRoute.size()-1; k++)// run through all nodes within existing route
				{
    				if(srcId[i]== curExistingRoute.get(k) && dstId[i]== curExistingRoute.get(k+1) || srcId[i]== curExistingRoute.get(k+1) && dstId[i]== curExistingRoute.get(k))//source & dest of ith link are in curRoute; II because routes are bidir
    				{
    					usedIndices.get(usedIndices.size()-1).add(curExistingRouteInd);
    					double ExistingRouteWidth = ExistingRouteSRlist.get(j)/gridDF;
                		int indrange = (int) Math.round(ExistingRouteWidth/2.0);
                		operationalRouteIndices.get(operationalRouteIndices.size()-1).add(j);
                  		  for(int klm = curExistingRouteInd-indrange;klm<curExistingRouteInd+indrange +1;klm++)// occupies more than one index, i.e. ch width  is more than df (grid spacing)//should also work for flex grid
                  		  {
                  			  if(-1<klm)
                  			  {
                  				usedIndices.get(usedIndices.size()-1).add(klm);// that is too crude - width of adjacent channels shall be used
                  			  }
                  		  }
    				}
    			}
    		}
    	}

    	int curMaxLinkCapacity = 0;//maximal link capacity

    	for(int i = 0; i < NetworkLinkCount; i++ ) // add links to network graph
    	{
        	NetEdge curEdge = new NetEdge(linkWeight[i], linkLabel.get(i), srcId[i], dstId[i], linkLength[i], linkCapacity[i],usedIndices.get(i),linkOEOstate[i]);
        	curEdge.operTDindList = operationalRouteIndices.get(i);
        	CurEdgeList.add(curEdge);
        	if(curEdge.label.contains("_Bamp"))
        	{
        		//debug
        		//System.out.println(curEdge.label);
        	}
        	if(curMaxLinkCapacity < linkCapacity[i])
        	{
        		curMaxLinkCapacity = linkCapacity[i];
        	}

    	}

    	for (int i = 0; i < NetworkNodeCount; i++ ) // add nodes to network graph
    	{

    		ArrayList<Integer> curInConSrcIdList = new ArrayList<Integer>();
    		ArrayList<Integer> curOutConDstIdList = new ArrayList<Integer>();


    		for(int j = 0; j < NetworkLinkCount; j++ )
    		{
    			NetEdge curEdge = CurEdgeList.get(j);

    			if(i==curEdge.snId)//this node is start node of the link
    			{
    				curOutConDstIdList.add(curEdge.enId);
    			}
    			if(i==curEdge.enId)//this node is end node of the link
    			{
    				curInConSrcIdList.add(curEdge.snId);
    			}
    		}

    		String curNdLabel = ndLabel.get(i);

    		NetNode curNode = new NetNode(i, curNdLabel,curInConSrcIdList,curOutConDstIdList);
    		for(NetEdge el: CurEdgeList)
    		{
    			if((i == el.snId || i == el.enId) && (el.label.contains("fiber")))
    			{
    				curNode.length = el.length;
    				break;
    			}
    		}
    		CurNodeList.add(curNode);
    	}
    	for (NetNode curNode : CurNodeList ) // create LTP for each node, assume one LTP per node for now
    	{
    		curNode.createLTP(CurNodeList);//with signals

    		//curNode.printNode();// debug info
    	}


		for(int j = 0; j < ExistingRouteList.size(); j++)//add existing TDs
		{
			int tmpTDid = CurTDlist.size();

			LinkedList<Integer> curExistingRoute =  ExistingRouteList.get(j);
			int curExistingRouteInd = ExistingRouteIndexList.get(j);
			ArrayList<Route>  tmpRouteList = new ArrayList<Route>();
			Route tmpRoute = new Route();
			tmpRoute.Route =  curExistingRoute;
			tmpRoute.FreqIndex = curExistingRouteInd;
			tmpRouteList.add(tmpRoute);

    		ConnectivityRequest curTD = new ConnectivityRequest(curExistingRoute.get(0), curExistingRoute.get(curExistingRoute.size()-1), ExistingRouteBRlist.get(j), ExistingRouteSRlist.get(j),ExistingRouteMFlist.get(j),tmpRouteList,null,null,ExistingRouteSRlist.get(j)/gridDF);
    		curTD.tdID = tmpTDid;
        	CurTDlist.add(curTD);
		}

    	for(int i = 0; i < src.length; i++ ) //add TDs to route
    	{
    		int tmpTDid = CurTDlist.size();

    		ArrayList<Route>  tmpRouteList = new ArrayList<Route>();
    		ArrayList<NetEdge> tmpLinkToExclude = new ArrayList<NetEdge>();
    		for(int j : linksToExclude.get(i))
    		{
    			tmpLinkToExclude.add(CurEdgeList.get(j));
    		}
    		ArrayList<NetEdge> tmpLinkToInclude = new ArrayList<NetEdge>();
    		for(int j : linksToInclude.get(i))
    		{
    			tmpLinkToInclude.add(CurEdgeList.get(j));
    		}
    		ConnectivityRequest curTD = new ConnectivityRequest(src[i], dst[i], BR[i], SR[i], MF[i],tmpRouteList,tmpLinkToExclude,tmpLinkToInclude,SR[i]/gridDF);
    		curTD.tdID = tmpTDid;
        	CurTDlist.add(curTD);
    	}


    	NetEdge[] tmpEdgeList = new NetEdge[CurEdgeList.size()];
        CurEdgeList.toArray(tmpEdgeList);

    	NetNode[] tmpNodeList = new NetNode[CurNodeList.size()];
    	CurNodeList.toArray(tmpNodeList);

    	ConnectivityRequest[] tmpTDlist = new ConnectivityRequest[CurTDlist.size()];
    	CurTDlist.toArray(tmpTDlist);

    	OptNetwork curNetworkGraph = new OptNetwork(tmpEdgeList,tmpNodeList,curNetworkCapacity, curMaxLinkCapacity,tmpTDlist,gridDF);

    	for(ConnectivityRequest curTD : CurTDlist)
    	{
    		if(false == curTD.RouteList.isEmpty())
    		{
    			curNetworkGraph.calcRouteLengthWeight(curTD.RouteList.get(curTD.RouteList.size()-1));
    			curTD.OperationalRoute = curTD.RouteList.get(curTD.RouteList.size()-1);
    		}
    	}

    	return curNetworkGraph;
    }

}
