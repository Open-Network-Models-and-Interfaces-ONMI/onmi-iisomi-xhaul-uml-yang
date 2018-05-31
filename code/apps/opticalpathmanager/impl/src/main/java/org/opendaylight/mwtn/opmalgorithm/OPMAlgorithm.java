package org.opendaylight.mwtn.opmalgorithm;


import java.text.DecimalFormat;
import java.util.ArrayList;

import java.util.List;


import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.PriorityQueue;

import java.util.Scanner;

public class OPMAlgorithm {

	public static void main(String[] args) 
{
			long startTime = System.currentTimeMillis();
		
		OptNetwork NetworkGraph = getNetworkData();// builds artificial network, connectivity requests
		long endTime = System.currentTimeMillis();
		long dt = endTime-startTime;
		System.out.println("Get network data time: "+ String.valueOf(dt));
		
		NetworkGraph.calcLinskWeight();//calculates initial weight
		//NetworkGraph.printEdgeWeight(); // debug info
		//ArrayList<ArrayList<NetEdge>> graph = prepareDijkstraGraph(NetworkGraph.edgeList,null);
		
		//NetworkGraph.PrintNetworkGraph(); // debug info

		for(int i = 0;i < NetworkGraph.tdList.length;i++)
		{
			ConnectivityRequest curTD = NetworkGraph.tdList[i];

			if(curTD.RouteList.isEmpty())// if some TDs routed exist in the network - search for routes for unrouted TDs only
			{
				ArrayList<ArrayList<NetEdge>> graph = prepareDijkstraGraph(NetworkGraph.edgeList,curTD,null);
			
				LinkedList<Integer> res = shortest_path(graph,curTD,NetworkGraph);

				if (0 < res.size())// primary route exists
				{
					Route resRoute = new Route();
					resRoute = curTD.RouteList.get(curTD.RouteList.size()-1);
					
					NetworkGraph.calcRouteLengthWeight(resRoute);
					//NetworkGraph.updateIndicesUsedByLinks(resRoute,curTD.Width);
					
					NetworkGraph.tdList[i].RouteList.set(curTD.RouteList.size()-1,resRoute);// the 1st route with lowest weight
	
					ArrayList<ArrayList<NetEdge>> tmpLinksToExclude= excludeEdgesForAltRoutes(resRoute.RouteByLinks);
	
			        for (int k = 0; k< tmpLinksToExclude.size(); k++)// here should be the loop over route links to get alternate routes
			        {
						graph = prepareDijkstraGraph(NetworkGraph.edgeList,curTD,tmpLinksToExclude.get(k));//to update weight - to exclude cur route links from alternate route
				//		add here alternate routes, e.g. remove edge assigned from graph and build new route for each edge in original route, so there could be originalRoute.length alternatives
						res = shortest_path(graph,curTD,NetworkGraph);
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

	public static 	ArrayList<ArrayList<NetEdge>> excludeEdgesForAltRoutes(LinkedList<NetEdge> primaryRoute)
	{
		ArrayList<ArrayList<NetEdge>> EdgesToEcludeCol = new ArrayList<ArrayList<NetEdge>>();
		
		ArrayList<NetEdge> tmpEdgeListAll = new ArrayList<NetEdge>();
		ArrayList<NetEdge> tmpEdgeListFrstAndLst = new ArrayList<NetEdge>();
		for(int k = 0; k < primaryRoute.size(); k++)
		{
			ArrayList<NetEdge> tmpEdgeList = new ArrayList<NetEdge>();
			tmpEdgeList.add(primaryRoute.get(k));
			tmpEdgeListAll.add(primaryRoute.get(k));
			EdgesToEcludeCol.add(new ArrayList<NetEdge>());
			EdgesToEcludeCol.set(k, tmpEdgeList);	
		}
		
		tmpEdgeListFrstAndLst.add(primaryRoute.get(0));
		tmpEdgeListFrstAndLst.add(primaryRoute.get(primaryRoute.size()-1));
		EdgesToEcludeCol.add(new ArrayList<NetEdge>());
		EdgesToEcludeCol.set(EdgesToEcludeCol.size()-1, tmpEdgeListFrstAndLst);
		EdgesToEcludeCol.add(new ArrayList<NetEdge>());
		EdgesToEcludeCol.set(EdgesToEcludeCol.size()-1, tmpEdgeListAll);
		
		return EdgesToEcludeCol;
	}
	
    public static LinkedList<Integer> shortest_path(ArrayList<ArrayList<NetEdge>> graph, ConnectivityRequest curTD, OptNetwork NetworkGraph)
    {
    	int source = curTD.SrcNdId;
    	int goal = curTD.DstNdId;
    	//int curTDrouteListSize = curTD.RouteList.size();
    	//----------------------------------------
    	int CurTDind = -1;
    	
    	boolean duplicate = false;
    	
    	int MaxNumberOfIndices = NetworkGraph.networkCapacity < NetworkGraph.maxLinkCapacity ? NetworkGraph.networkCapacity : NetworkGraph.maxLinkCapacity;  
    	
    	ArrayList<Integer> NetworkFreeIndices = new ArrayList<Integer>();
        ArrayList<Integer> free_Indices = new ArrayList<Integer>(); 
        
        for(int i = 0; i < MaxNumberOfIndices; i++) {
        	NetworkFreeIndices.add(i);    
        	free_Indices.add(i);
        }
        //--------------------------------------------
        
    	LinkedList<Integer> result = new LinkedList<Integer>();

        ArrayList<Location> locations = new ArrayList<Location>();
        for(int i = 0; i < graph.size(); i++) {
            locations.add(new Location(Integer.MAX_VALUE, Double.MAX_VALUE));
        }

        PriorityQueue<Integer> location_queue = new PriorityQueue<Integer>(1, new LocationComparator(locations));

        location_queue.add(source);
        while (false == location_queue.isEmpty())
        {
            int current = location_queue.poll();
            
            if(goal == current && locations.get(current).weight < Double.MAX_VALUE )
            {

            	do
                  {
            		
                    ArrayList<Integer> usedIndices = locations.get(current).usedIndices;  
                    free_Indices.removeAll(usedIndices);
            		if(false == free_Indices.isEmpty())
            		{
            			if(result.contains(current))
            			{
            				System.out.println("!!!---Circle in the route---!!!\nLocations: ");
            				result = new LinkedList<Integer>();
            				for(Location el : locations)
            				{
            					System.out.print(el.source);
            					System.out.print(" ; ");
            				}
            				System.out.println("\n!!!Route is skipped!!!");
            				return result;
            			}
                      result.addFirst(current);
                      current = locations.get(current).source;
            		}
                  }
                  while (current != source);

                  result.addFirst(source);
                  
                  
                  for(Route el : curTD.RouteList)
                  {
                	  if(result.equals(el.Route))
                	  {
                		  //System.out.println(result.toString()+ " - DUPLICATE!");
                		  duplicate = true;
                		  break;
                	  }
                  }

                  //-----------------------------
//                  if (1 < curTD.Width)//recalculate free indices w/r/t ch width
//                  {
                	  
                	  for(int m = 0; m < NetworkFreeIndices.size(); m++)
                	  {
                		  ArrayList<Integer> indexListRequired = new ArrayList<Integer>();
                		  
                		  int indrange = (int) Math.round(curTD.Width/2.0);
                		  
                		  for(int klm = m-indrange;klm<m+indrange +1;klm++)//should also work for flex grid
                		  {
                			  if(-1<klm)
                			  {
                				  indexListRequired.add(klm);
                			  }
                		  }
                		  if (true == free_Indices.containsAll(indexListRequired))//!!! does not account for width of neighbors, shall be covered by used indices. see updateIndicesUsedByLinks() That is too crude - width of adjacent channels shall be used
                		  {
                			  //System.out.println(result.toString()+ " - qwa!");
                			  CurTDind = m;
                			  break;
                		  }
                	  }
//                  }
                  //System.out.println(curTD.RouteList.size());
                  
                  if(false == duplicate && 0 < result.size() && -1 < CurTDind)
                  {
                	  
	                  curTD.RouteList.add(new Route());
	                  curTD.RouteList.get(curTD.RouteList.size()-1).FreqIndex = CurTDind;
	
	                  curTD.RouteList.get(curTD.RouteList.size()-1).Route = result;
                  }
                  else 
                  {
                	  result = new LinkedList<Integer>();
                  }
                  //-------------------------------
                  
                  return result;
            }

            double location_weight = locations.get(current).weight < Double.MAX_VALUE ? locations.get(current).weight : 0.;

           ArrayList<Integer> location_FreeIndices = new ArrayList<Integer>();
           for(int el: NetworkFreeIndices)
           {
        	   location_FreeIndices.add(el);
           }
        		   
            for (NetEdge path : graph.get(current))
            {
            	//NetworkGraph.calcCurEdgeWeight(path);
	            double weight = path.calcCurEdgeWeight(location_weight);//path.calcCurEdgeWeight(location_weight);//location_weight + path.weight;
	            //System.out.println("weight: "+ String.valueOf(weight));
	            //System.out.println("location_weight: "+ String.valueOf(location_weight));
	            ArrayList<Integer> location_UsedIndices = new ArrayList<Integer>();//locations.get(current).usedIndices;
	            location_UsedIndices.addAll(path.usedIndices);
	            location_FreeIndices.removeAll(location_UsedIndices);
             
              if (weight < locations.get(path.goal).weight && false == location_FreeIndices.isEmpty())//current location has free indices to assign
              {
	                locations.get(path.goal).source = current;
	                locations.get(path.goal).weight = weight;
	                //locations.get(path.goal). = weight;      
	                //-----------------------------------------
	                locations.get(path.goal).linkCapacity = path.linkCapacity;
	                locations.get(path.goal).usedIndices.addAll(location_UsedIndices);
	                //------------------------------------------
	                location_queue.add(path.goal);           	  
              }
            }
        }
       
        return result;
    }
    	
    public static ArrayList<ArrayList<NetEdge>> prepareDijkstraGraph(NetEdge[] EdgeList,ConnectivityRequest curTD,ArrayList<NetEdge> EdgeToExcludeList)
    {
        ArrayList<ArrayList<NetEdge>> g = new ArrayList<ArrayList<NetEdge>>();

        
        
        for(int i = 0; i < EdgeList.length; i++ )
        {

            int nodeID = EdgeList[i].snId; 

            NetEdge v0 =  new NetEdge(EdgeList[i].weight,EdgeList[i].label,EdgeList[i].snId,EdgeList[i].enId,EdgeList[i].length,EdgeList[i].linkCapacity,EdgeList[i].usedIndices,EdgeList[i].oeo);//EdgeList[i];
            v0.noiseIn = EdgeList[i].noiseIn;
            //public NetEdge(double weight, String label, int srcId, int dstId, double linkLength, int linkCapacity,ArrayList<Integer> usedIndices)
            if(null != EdgeToExcludeList)
            {
            	for(NetEdge el : EdgeToExcludeList)
            	{
	        		if(el.label == v0.label)//this is alg request - low priority 
	        		{
	        			v0.weight += 10000; 
	        			break;
	        		}
            	}
            }
            
            for(NetEdge el : curTD.LinksToExclude)// this is user request - high priority
            {
            	if(el.label == v0.label)
            	{
            		v0.weight +=10000; 
            		break;
            	}
            }
            for(NetEdge el : curTD.LinksToInclude)// this is user request - high priority - can overwrite alg request
            {
            	if(el.label == v0.label)
            	{
            		v0.weight = 0.5;//*=0;
            		break;
            	}
            }
            
            if(g.size() < nodeID + 1)
            {
                for(int m = g.size(); m < nodeID + 1; m++)
                {
                    g.add(new ArrayList<NetEdge>());
                }
            }

            g.get(nodeID).add(v0);
        }

        return g;
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
		/*
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(8,0,1,3,11)));//red		
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(10,1,2,4,5,13)));//green
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(9,0,2,6,7,4,3,5,12)));//blue
		*/
		
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(52, 53, 54, 0, 1, 2, 3, 4, 5, 6, 18, 19, 20, 21, 22, 23, 63, 62, 61)));//red	
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(58, 59, 60, 6, 7, 8, 9, 10, 11, 12, 48, 47, 46, 49, 50, 51, 29, 40, 39, 38, 37, 36, 23, 35, 34, 33, 32, 31, 30, 69, 68, 67)));//green
		ExistingRouteList.add(new LinkedList<Integer>(Arrays.asList(55, 56, 57, 0, 13, 14, 15, 16, 17, 12, 48, 47, 46, 49, 50, 51, 29, 45, 44, 43, 42, 41, 30, 69, 68, 67)));//blue
		
		ArrayList<Integer> ExistingRouteIndexList = new ArrayList<Integer>();//Center index, i.e. channel center freq
		ExistingRouteIndexList.add(0);		ExistingRouteIndexList.add(5);		ExistingRouteIndexList.add(10);
		ArrayList<Double> ExistingRouteBRlist = new ArrayList<Double>();
		ExistingRouteBRlist.add(112.);		ExistingRouteBRlist.add(112.);		ExistingRouteBRlist.add(112.);
		ArrayList<Double> ExistingRouteSRlist = new ArrayList<Double>();
		ExistingRouteSRlist.add(28.);		ExistingRouteSRlist.add(28.);		ExistingRouteSRlist.add(28.);		
		ArrayList<String> ExistingRouteMFlist = new ArrayList<String>();
		ExistingRouteMFlist.add("NA");		ExistingRouteMFlist.add("NA");		ExistingRouteMFlist.add("NA");
		//----------------------------------------------------		
		    	
    	//String[] InputLinkLabel = {"C0-C1","C1-C2","C0-C2","C1-A1","C2-A2","A0-A1","A1-A2","A0-A2","oeo1-C2","oeo2-A2","oeo1-oeo2"};//,"ETY1-C0","ETY2-C0","ETY3-C1","ETY4-A1","ETY5-A0","ETY6-A0"};
    	String[] InputLinkLabel = {"C0-C1","C1-C2","C0-C2","C1-A1","C2-A2","A0-A1","A1-A2","A0-A2","oeo1-C2","oeo2-A2","oeo1-oeo2","ETY1-C0","ETY2-C0","ETY3-C1","ETY4-A1","ETY5-A0","ETY6-A0"};
    	
    	//double[] InputLinkLength = {75,80,43,1,1,120,60,63,0,0,0};//,0,0,0,0,0,0};//length-(to do)->data: length, loss(coeff), boost(G,NF), pre(G,NF), capacity// oeo - later, now oeo from label -> 6(7) params in total
    	double[] InputLinkLength = {75,80,43,1,1,120,60,63,0,0,0,0,0,0,0,0,0};
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
		int[] src = {ndLabel.indexOf("ETY1")};//{55,58};//{34};// {0};// {8};// {8,9,10,9};
		int[] dst = {ndLabel.indexOf("ETY6")};//{67,67};//{44};// {5};// {13};// {11,12,13,6};
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

class NetworkInputData
{
	  NetworkInputData(String[] linkLabelList,double[] linkLengthList,int linkCapacity)
	  {
		  ArrayList<String> tmpLinkLabelList= new ArrayList<String>();
		  ArrayList<Double> tmpLinkLengthList= new ArrayList<Double>();
		  
		  for (int i = 0; i < linkLabelList.length; i++)
		  {
			// this loop is to expand each link to list of LTPs, 
			// if length>0 then edge=src->dst =>src->amp->fiber->amp->dst & length=>0,0,length,0,0
			// if both  are oeo => no changes
			// if src = oeo => oeo->dst => oeo->mdx->amp->dst & length=0=>0,0,0
			// if dst = oeo => src->oeo => src->amp->mdx->oeo & length=0=>0,0,0
			// if src = ETY or dst = ETY => same as for oeo->dst and src->oeo
			  String el = linkLabelList[i];
			  double curLength = linkLengthList[i];
			  String[] strParts = el.split("-");
			  String tmpPrefix = strParts[0]+":"+strParts[1];
			  //initial edges
			  
			  //tmpLinkLabelList.add(el);
			  //tmpLinkLengthList.add(curLength);
			  
			  
			  //extension of edges to LTPs
			  
			  if(strParts[0].contains("oeo") && strParts[1].contains("oeo"))
			  {
				  
				  tmpLinkLabelList.add(el);
				  tmpLinkLengthList.add(curLength);
				  //System.out.println("oeo-oeo: " + el);
			  }
			  else if (strParts[0].contains("oeo"))
			  {
				  
				  tmpLinkLabelList.add(strParts[0]+"-"+tmpPrefix+"_mdx");
				  tmpLinkLabelList.add(tmpPrefix+"_mdx"+"-"+tmpPrefix+"_amp");
				  tmpLinkLabelList.add(tmpPrefix+"_amp"+"-"+strParts[1]);
				  tmpLinkLengthList.add(0.0);
				  tmpLinkLengthList.add(curLength);
				  tmpLinkLengthList.add(0.0);
				  //System.out.println("after oeo: " + strParts[0]+"-"+tmpPrefix+"_mdx");
			  }
			  else if (strParts[1].contains("oeo"))
			  {
				  
				  tmpLinkLabelList.add(strParts[0]+"-"+tmpPrefix+"_amp");
				  tmpLinkLabelList.add(tmpPrefix+"_amp"+"-"+tmpPrefix+"_mdx");
				  tmpLinkLabelList.add(tmpPrefix+"_mdx"+"-"+strParts[1]);
				  tmpLinkLengthList.add(0.0);
				  tmpLinkLengthList.add(curLength);
				  tmpLinkLengthList.add(0.0);
				  //System.out.println("before oeo: " + tmpPrefix+"_mdx"+"-"+strParts[1]);
			  }
			  else if(strParts[0].contains("ETY"))
			  {
				  
				  tmpLinkLabelList.add(strParts[0]+"-"+tmpPrefix+"_mdx");
				  tmpLinkLabelList.add(tmpPrefix+"_mdx"+"-"+tmpPrefix+"_amp");
				  tmpLinkLabelList.add(tmpPrefix+"_amp"+"-"+strParts[1]);
				  tmpLinkLengthList.add(0.0);
				  tmpLinkLengthList.add(curLength);
				  tmpLinkLengthList.add(0.0);
				  
				  //System.out.println("after ETY: " + strParts[0]+"-"+tmpPrefix+"_mdx");
			  }
			  else if (strParts[1].contains("ETY"))
			  {
				  
				  tmpLinkLabelList.add(strParts[0]+"-"+tmpPrefix+"_amp");
				  tmpLinkLabelList.add(tmpPrefix+"_amp"+"-"+tmpPrefix+"_mdx");
				  tmpLinkLabelList.add(tmpPrefix+"_mdx"+"-"+strParts[1]);
				  tmpLinkLengthList.add(0.0);
				  tmpLinkLengthList.add(curLength);
				  tmpLinkLengthList.add(0.0);
				  //System.out.println("before ETY: " + tmpPrefix+"_mdx"+"-"+strParts[1]);
			  }
			  else//neither oeo, nor ETY exists, i.e. edge=src->dst =>src->amp->fiber->amp->dst & length=>0,0,length,0,0,0
			  {
				  //System.out.println("others");
				  tmpLinkLabelList.add(strParts[0]+"-"+tmpPrefix+"_B_mdx");
				  //System.out.println(strParts[0]+"-"+tmpPrefix+"_B_mdx");
				  
				  tmpLinkLabelList.add(tmpPrefix+"_B_mdx"+"-"+tmpPrefix+"_Bamp");
				  //System.out.println(tmpPrefix+"_B_mdx"+"-"+tmpPrefix+"_Bamp");
				  
				  tmpLinkLabelList.add(tmpPrefix+"_Bamp"+"-"+tmpPrefix+"_fiber");
				 // System.out.println(tmpPrefix+"_Bamp"+"-"+tmpPrefix+"_fiber");
				  
				  tmpLinkLabelList.add(tmpPrefix+"_fiber"+"-"+tmpPrefix+"_Pamp");
				  //System.out.println(tmpPrefix+"_fiber"+"-"+tmpPrefix+"_Pamp");
				  
				  tmpLinkLabelList.add(tmpPrefix+"_Pamp"+"-"+tmpPrefix+"_P_mdx");
				 // System.out.println(tmpPrefix+"_Pamp"+"-"+tmpPrefix+"_P_mdx");
				  
				  tmpLinkLabelList.add(tmpPrefix+"_P_mdx"+"-"+strParts[1]);
				 // System.out.println(tmpPrefix+"_P_mdx"+"-"+strParts[1]);
				  
				  tmpLinkLengthList.add(0.0);
				  tmpLinkLengthList.add(0.0);
				  tmpLinkLengthList.add(curLength);
				  tmpLinkLengthList.add(0.0);
				  tmpLinkLengthList.add(0.0);
				  tmpLinkLengthList.add(0.0);
			  }

		  }
		  
		  ArrayList<String> curLinkLabellist= new ArrayList<String>();
		  ArrayList<String> curNodeLabelList = new ArrayList<String>();
		  ArrayList<Double> curLinkLengthList = new ArrayList<Double>();
		  ArrayList<Double> curLinkWeightList = new ArrayList<Double>();
		  ArrayList<Integer> curLinkCapacityList = new ArrayList<Integer>();
		  ArrayList<Integer> curLinkSrcIdList = new ArrayList<Integer>();
		  ArrayList<Integer> curLinkDstIdList = new ArrayList<Integer>();
		  ArrayList<Boolean> curLinkOEOstate = new ArrayList<Boolean>();
		  
		  for (int i = 0; i < tmpLinkLabelList.size(); i++)
		  {
			  String el = tmpLinkLabelList.get(i);
			  double curLength = tmpLinkLengthList.get(i);
			  double curWeight = curLength;
			  int curCapacity = linkCapacity;
			  
			  String[] strParts = el.split("-");
			  String BAlinkLabel =  strParts[1]+"-"+strParts[0];
			  String ABlinkLAbel =  strParts[0]+"-"+strParts[1];
			  /*
			  if(strParts[0].contains("_fiber") && strParts[1].contains("_Pamp"))
			  {
				  BAlinkLabel = strParts[1].replace("P", "B")+"-"+strParts[0];
			  }
			  if(strParts[1].contains("_fiber") && strParts[0].contains("_Bamp"))
			  {
				  BAlinkLabel = strParts[1]+"-"+strParts[0].replace("B", "P");
			  }
			  */
			  curLinkLabellist.add(ABlinkLAbel);
			  curLinkLabellist.add(BAlinkLabel);
			  
			  curLinkLengthList.add(curLength);
			  curLinkLengthList.add(curLength);
			  
			  curLinkWeightList.add(curWeight);
			  curLinkWeightList.add(curWeight);
			  
			  curLinkCapacityList.add(curCapacity);
			  curLinkCapacityList.add(curCapacity);
			  
			  if(strParts[0].contains("oeo") && strParts[1].contains("oeo"))
			  {
				  curLinkOEOstate.add(true);
				  curLinkOEOstate.add(true);
			  }
			  else
			  {
				  curLinkOEOstate.add(false);
				  curLinkOEOstate.add(false);				  
			  }
			  
			  if(false == curNodeLabelList.contains(strParts[0]))
			  {
				  curNodeLabelList.add(strParts[0]);
			  }
			  if(false == curNodeLabelList.contains(strParts[1]))
			  {
				  curNodeLabelList.add(strParts[1]);
			  }
			  
			  curLinkSrcIdList.add(curNodeLabelList.indexOf(strParts[0]));
			  curLinkSrcIdList.add(curNodeLabelList.indexOf(strParts[1]));
			  
			  curLinkDstIdList.add(curNodeLabelList.indexOf(strParts[1]));
			  curLinkDstIdList.add(curNodeLabelList.indexOf(strParts[0]));			  
		  }
		  
		  this.ndLabel = curNodeLabelList;
		  //this.ndLabel = new String[curNodeLabelList.size()];
		  //curNodeLabelList.toArray(this.ndLabel);
		  
		  this.linkLabel = curLinkLabellist;
		  //this.linkLabel = new String[curLinkLabellist.size()];
		  //curLinkLabellist.toArray(this.linkLabel);
		  
		  this.linkLength = new double[curLinkLengthList.size()];
		  this.linkWeight = new double[curLinkWeightList.size()];
		  this.linkCapacity = new int[curLinkCapacityList.size()];
		  this.srcId = new int[curLinkSrcIdList.size()];
		  this.dstId = new int[curLinkDstIdList.size()];
		  this.linkOEOstate = new boolean[curLinkOEOstate.size()];
		  
		  for(int i = 0; i < linkLength.length; i++)
		  {
			  this.linkLength[i] = curLinkLengthList.get(i);
			  this.linkWeight[i] = curLinkWeightList.get(i);
			  this.linkCapacity[i] = curLinkCapacityList.get(i);
			  this.srcId[i] = curLinkSrcIdList.get(i);
			  this.dstId[i] = curLinkDstIdList.get(i);
			  this.linkOEOstate[i] = curLinkOEOstate.get(i);
		  }
		  
	  }
	  public ArrayList<String> linkLabel;
	  public ArrayList<String> ndLabel;
	  public double[] linkLength;
	  public double[] linkWeight;
	  public int[] linkCapacity;
	  public int[] srcId;
	  public int[] dstId;
	  public boolean[] linkOEOstate;
	  /*
	String[] linkLabel = {"C0-C1","C1-C0","C1-C2","C2-C1","C0-C2","C2-C0","C1-A1","A1-C1","C2-A2","A2-C2","A0-A1","A1-A0","A1-A2","A2-A1","A0-A2","A2-A0","oeo1-C2","C2-oeo1","oeo2-A2","A2-oeo2","oeo1-oeo2","oeo2-oeo1"};
	String[] ndLabel = {"C0","C1","C2","A2","A1","A0","oeo1","oeo2"};//{C0,C1,C2,A2,A1,A0,oeo1,oeo2} <-->{0,1,2,3,4,5,6,7}
	int[] srcId = {0,1,1,2,0,2,1,4,2,3,5,4,4,3,5,3,6,2,7,3,6,7};
	int[] dstId = {1,0,2,1,2,0,4,1,3,2,4,5,3,4,3,5,2,6,3,7,7,6};
	double[] linkWeight = {75,75,80,80,43,43,1,1,1,1,120,120,60,60,63,63,0,0,0,0,0,0};
	double[] linkLength = {75,75,80,80,43,43,1,1,1,1,120,120,60,60,63,63,0,0,0,0,0,0};
	int[] linkCapacity = {20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20};
	boolean[] linkOEOstate = {false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true};
	  */
}

class OchSignal
{
	OchSignal()
	{
		this.Src = null;
		this.Dst = null;
		this.powerList = new ArrayList<Double>();
		this.noisePsdList = new ArrayList<Double>();
		this.osnrList = new ArrayList<Double>();
		this.centerIndexList = new ArrayList<Integer>();
	}
	OchSignal(MyLTP srcLtp,MyLTP dstLtp, ArrayList<Double> powerList, ArrayList<Double> noisePsdList, ArrayList<Double> osnrList,ArrayList<Integer> centerIndexList)
	{
		this.Src = srcLtp;
		this.Dst = dstLtp;
		this.powerList = new ArrayList<Double>();
		this.powerList = powerList;
		this.noisePsdList = new ArrayList<Double>();
		this.noisePsdList = noisePsdList;
		this.osnrList = new ArrayList<Double>();
		this.osnrList = osnrList;
		this.centerIndexList = new ArrayList<Integer>();
		this.centerIndexList = centerIndexList;

	}
	
	public void printOchSignal(String sigPrefix)
	{
		DecimalFormat decForm = new DecimalFormat("###.##");
		
		String tmpStr = this.Dst != null? this.Dst.ltpLabel : "Null";
		//System.out.println(sigPrefix+" Signal Dst: " + tmpStr);
		tmpStr = this.Src != null? this.Src.ltpLabel : "Null";
		//System.out.println(sigPrefix+" Signal Src: " + tmpStr);
		System.out.println(sigPrefix+" Signal Index: " + this.centerIndexList.toString());
		tmpStr = this.powerList.size() == 0? this.powerList.toString() : String.valueOf(decForm.format(10*Math.log10(this.powerList.get(0)*1000)));
		System.out.println(sigPrefix+" Signal power: " + tmpStr);
		System.out.println(sigPrefix+" Signal noisePsd: " + this.noisePsdList.toString());
		tmpStr = this.osnrList.size() == 0? this.osnrList.toString() : String.valueOf(decForm.format(10*Math.log10(this.osnrList.get(0))));
		System.out.println(sigPrefix+" Signal osnr: " + tmpStr);

	}
	
	MyLTP Src;
	MyLTP Dst;
	ArrayList<Double> powerList;
	ArrayList<Double> osnrList;
	ArrayList<Double> noisePsdList;
	ArrayList<Integer> centerIndexList;
}


class Route
{
	public Route()
	{
		this.Route = new LinkedList<Integer>();
		this.RouteLength = -1;
		this.RouteWeight = -1;
		this.RouteByNodes = new LinkedList<NetNode>();
		this.RouteByLinks = new LinkedList<NetEdge>();
		this.FreqIndex = -1;
		this.RouteCumulativeWeight = 0;
		this.RouteNoise = 0;
		this.RouteBAnoise = 0;
		this.RouteOsnr = 58;//dB uinits
		this.RouteBAosnr = 58;
	}
	public Route(LinkedList<Integer> nodeIdList,double RouteLength,double RouteWeight,LinkedList<NetNode> RouteByNodes,LinkedList<NetEdge> RouteByLinks,int FreqIndex)
	{
		this.Route = new LinkedList<Integer>();
		this.Route = nodeIdList;
		this.RouteLength = RouteLength;
		this.RouteWeight = RouteWeight;
		this.RouteByNodes = new LinkedList<NetNode>();
		this.RouteByNodes = RouteByNodes;
		this.RouteByLinks = new LinkedList<NetEdge>();
		this.RouteByLinks = RouteByLinks;
		this.FreqIndex = FreqIndex;
		this.RouteCumulativeWeight = 0;
		this.RouteNoise = 0;
		this.RouteBAnoise = 0;
		this.RouteOsnr = 58;//dB uinits
		this.RouteBAosnr = 58;
		this.RouteLTPlist = new ArrayList<MyLTP>();
	}
	
	LinkedList<Integer> Route; //list of node ids
	double RouteLength;
	double RouteWeight;
	LinkedList<NetNode> RouteByNodes;
	LinkedList<NetEdge> RouteByLinks;
	double RouteCumulativeWeight;
	double RouteNoise;
	double RouteBAnoise;
	double RouteOsnr;
	double RouteBAosnr;
	int FreqIndex;
	public ArrayList<MyLTP> RouteLTPlist;
	
	}

class ConnectivityRequest
{
	public ConnectivityRequest(int SrcNdId,int DstNdId)
	{
		this.tdID = -1;
		this.SrcNdId = SrcNdId;
		this.DstNdId = DstNdId;
		this.BitRate = 0;
		this.SymbolRate = 0;
		this.Width = 0;
		this.Modulation = "NA";
		this.RouteList = new ArrayList<Route>();
		this.LinksToExclude = new ArrayList<NetEdge>();
		this.LinksToInclude = new ArrayList<NetEdge>();
		this.OperationalRoute = new Route();
	}
	
	public ConnectivityRequest(int SrcNdId,int DstNdId,double BitRate,double SymbolRate,String Modulation,ArrayList<Route> RouteList,ArrayList<NetEdge> LinksToExclude,ArrayList<NetEdge> LinksToInclude, double Width)
	{
	
		this.tdID = -1;
		this.SrcNdId = SrcNdId;
		this.DstNdId = DstNdId;
		this.BitRate = BitRate;
		this.SymbolRate = SymbolRate;
		this.Width = Width;
		this.Modulation = Modulation;
		this.RouteList = new ArrayList<Route>();
		this.RouteList = RouteList;
		this.LinksToExclude = new ArrayList<NetEdge>();
		this.LinksToExclude = LinksToExclude;
		this.LinksToInclude = new ArrayList<NetEdge>();
		this.LinksToInclude = LinksToInclude;
		this.OperationalRoute = new Route();	
	}
	
	public void printTDdata()
	{
		System.out.print("\n");
		System.out.println("TD ID: "+ String.valueOf(this.tdID));
		System.out.print("!--Traffic Demand & Route:--! ");
		System.out.print(this.SrcNdId );
		System.out.print(" <---> ");
		System.out.println(this.DstNdId);

		System.out.println("OperationalRoute: " + this.OperationalRoute.Route.toString());
		for(int i = 0; i < this.RouteList.size(); i++)
		{
			Route el = RouteList.get(i);

			System.out.print("Route ID: ");
			System.out.println(i);
			
			System.out.print(el.Route.toString());
			
			System.out.print("; FreqInd = ");
			System.out.print(el.FreqIndex);
			
			System.out.print("; Length = ");
			System.out.print(el.RouteLength);
			//System.out.print("; Weight = ");
			//System.out.println(el.RouteWeight);
			
			//System.out.print("\t\t\t\tWeightCumulative = ");
			//System.out.println(el.RouteCumulativeWeight);
			//System.out.print("\n\t\t\t\tRoute NoisePsd(dBm/Hz) = ");
			//System.out.println(10*Math.log10(el.RouteNoise*1000));			
			System.out.print("\n\t\t\tRoute Osnr(dB, w/r/t Ps=0dBm) = ");
			System.out.println(el.RouteOsnr);	
			System.out.print("\t\t\tRoute Osnr Degradation (dB) = ");
			double dOsnr = 58 - el.RouteOsnr;
			System.out.println(dOsnr);
/*	
// differs when gain is not equal to loss
			System.out.print("\n\t\t\tRoute BA Osnr(dB, w/r/t Ps=0dBm) = ");
			System.out.println(el.RouteBAosnr);	
			System.out.print("\t\t\tRoute BA Osnr Degradation (dB) = ");
			dOsnr = 58 - el.RouteBAosnr;
			System.out.println(dOsnr);
*/			
			System.out.print("Route Link Labels: ");
			
			String tmpStr = "";
			for (NetEdge lnk : el.RouteByLinks)
			{
				tmpStr += lnk.label+"\t";
			};
			System.out.println(tmpStr);
			System.out.print("Route Node Labels: ");
			
			tmpStr = "";
			for (NetNode nd : el.RouteByNodes)
			{
				tmpStr += nd.ndLabel+"\t";
			};
			System.out.println(tmpStr+"\n");
		}
	}	
	
	int SrcNdId;
	int DstNdId;

	int tdID;
	
	double BitRate;
	double SymbolRate;
	double Width;//SR to dF ratio
	String Modulation;
	Route OperationalRoute;
	ArrayList<Route> RouteList;
	ArrayList<NetEdge> LinksToExclude;
	ArrayList<NetEdge> LinksToInclude;
	}

class OptNetwork
{
	public OptNetwork(NetEdge[] edgeList,NetNode[] nodeList,int networkCapacity, int maxLinkCapacity, ConnectivityRequest[] tdList,double gridDF)
	{
		this.edgeList = edgeList;
		this.nodeList = nodeList;
		this.networkCapacity = networkCapacity;
		this.maxLinkCapacity = maxLinkCapacity;
		this.tdList = tdList;
		this.gridDF = gridDF;
	}
	
	public void PrintNetworkGraph()
	{
		for(int i = 0; i < this.nodeList.length; i++)
		{
			NetNode tmpNode = nodeList[i];
			System.out.println("!---Nodes---!");
			System.out.println("\nNode ID: "+String.valueOf(tmpNode.ndId));
			System.out.println("Node Label: "+tmpNode.ndLabel);
			System.out.println("Connections from nodes: "+tmpNode.inConSrcIdList.toString());
			System.out.println("Connections to nodes: "+tmpNode.outConDstIdList.toString());
			
		}
	}

	public NetNode findNodeByID(int curNdId)
	{
		NetNode tmpNd = null;
		for(NetNode nd : this.nodeList)
		{
			if(curNdId == nd.ndId)
			{
				tmpNd = nd;
				break;
			}
		}
		return tmpNd;
	}
	
	public void calcRouteLengthWeight(Route curRoute)
	{
		LinkedList<Integer> tmpRoute = new LinkedList<Integer>();
		tmpRoute = curRoute.Route;
		curRoute.RouteLength = 0;
		curRoute.RouteWeight = 0;
		curRoute.RouteCumulativeWeight = 0;
		curRoute.RouteNoise = 0;
		curRoute.RouteBAnoise = 0;
		
		for(int i = 0; i < tmpRoute.size() - 1; i++)
		{
			int tmpSnId = tmpRoute.get(i);
			int tmpEnId = tmpRoute.get(i + 1);
			
			curRoute.RouteByNodes.add(findNodeByID(tmpSnId));
			
			for(int j = 0; j < this.edgeList.length; j++)
			{
				NetEdge tmpEdge = this.edgeList[j];
				if(tmpSnId == tmpEdge.snId && tmpEnId == tmpEdge.enId)
				{
					curRoute.RouteLength += tmpEdge.length;
					curRoute.RouteWeight += tmpEdge.weight;
					
					curRoute.RouteByLinks.add(tmpEdge);
					
					curRoute.RouteCumulativeWeight =tmpEdge.calcCurEdgeWeight(curRoute.RouteCumulativeWeight);
					
					curRoute.RouteNoise = tmpEdge.calcCurEdgeNoiseOut(curRoute.RouteNoise);
					//System.out.println(10*Math.log10(curRoute.RouteNoise*1000));	
					
					break;
				}				
			}
		}
		
		for(int i = tmpRoute.size() - 1; i > 0; i--)//reverse direction - just osnr calculation
		{
			int tmpSnId = tmpRoute.get(i);
			int tmpEnId = tmpRoute.get(i - 1);
			
			for(int j = 0; j < this.edgeList.length; j++)
			{
				NetEdge tmpEdge = this.edgeList[j];
				if(tmpSnId == tmpEdge.snId && tmpEnId == tmpEdge.enId)
				{
					curRoute.RouteBAnoise = tmpEdge.calcCurEdgeNoiseOut(curRoute.RouteBAnoise);	
					break;
				}				
			}
		}
		
		curRoute.RouteOsnr = 10.0*Math.log10(0.001/(curRoute.RouteNoise*12.5*Math.pow(10, 9)));
		curRoute.RouteBAosnr = 10.0*Math.log10(0.001/(curRoute.RouteBAnoise*12.5*Math.pow(10, 9)));
		curRoute.RouteByNodes.add(findNodeByID(tmpRoute.get(tmpRoute.size() - 1)));// this is added outside the loop because the loop covers[0,tmpRoute.size()-2]

	}
	
	public void updateIndicesUsedByLinks(Route curRoute,double routeWidth)
	{
		LinkedList<Integer> tmpRoute = new LinkedList<Integer>();
		tmpRoute = curRoute.Route;
		for(int i = 0; i < tmpRoute.size() - 1; i++)
		{
			int tmpSnId = tmpRoute.get(i);
			int tmpEnId = tmpRoute.get(i + 1);
			for(int j = 0; j < this.edgeList.length; j++)
			{
				NetEdge tmpEdge = this.edgeList[j];
				if(tmpSnId == tmpEdge.snId && tmpEnId == tmpEdge.enId || tmpSnId == tmpEdge.enId && tmpEnId == tmpEdge.snId)// || - for bidir connections!!!!
				{
					int curFreqIndex = curRoute.FreqIndex;
					if(false == tmpEdge.usedIndices.contains(curFreqIndex))//updating used indices here
					{
						//this.edgeList[j].usedIndices.add(curFreqIndex);
						
              		  int indrange = (int) Math.round(routeWidth/2.0);
            		  
              		  for(int klm = curFreqIndex-indrange;klm<curFreqIndex+indrange +1;klm++)// occupies more than one index, i.e. ch width  is more than df (grid spacing)//should also work for flex grid
              		  {
              			  if(-1<klm)
              			  {
              				this.edgeList[j].usedIndices.add(klm);// that is too crude - width of adjacent channels shall be used
              			  }
              		  }
						

					}
					break;
				}				
			}
		}
	}

	public void calcLinskWeight()// initial values for all edges in the graph
	{
		// several assumptions for now:
		// in noise - h*f
		// amp compensate loss
		// min noise figure 3dB
		// gain = loss
		// attn = 0.2db/km
		double ccc = 299792458;
		double h = 6.62606896e-34;
		double alpha = 0.2;
		double fref = ccc/(1.552e-6);
		double NF = Math.pow(10, 0.1*6.0);
		double noiseIn = h*fref;
		
		for (int i = 0; i < this.edgeList.length; i++)
		{
			NetEdge curEdge = this.edgeList[i];
			double gain = Math.pow(10,0.1*alpha*curEdge.length);
			double noiseOut = 0*gain+(NF*gain+1);//input noise is NOT amplified because gain is equal to loss of fiber
			double curWeight = 10.0*Math.log10(noiseOut);
			curEdge.weight = curEdge.oeo ? 1: curWeight;
			curEdge.noiseIn = noiseIn/noiseIn;
			curEdge.noiseOut = noiseOut;
		}
	}
	
	public void printEdgeWeight()
	{
		for(NetEdge el : this.edgeList)
		{
			System.out.println(el.label + " weight: "  + String.valueOf(el.weight));
			System.out.println(el.label + " Operational Inidices: "  + el.operTDindList.toString());
		}
	}

	private void buildOutputOchSignalTrail(ArrayList<OchSignal> curOutSigTrail, MyLTP curLTP , MyLTP nextLTP)
	{
    	for(OchSignal outSig : curLTP.outSignalList)
    	{
			if(null != nextLTP)
			{
        		if(outSig.Dst.ltpLabel == nextLTP.ltpLabel)
        		{
        			curOutSigTrail.add(outSig);
        		}
			}
			else
			{
				curOutSigTrail.add(null);
			}
    	}	
	}
	private void buildInputOchSignalTrail(ArrayList<OchSignal> curInSigTrail, MyLTP curLTP , MyLTP prevLTP)
	{
		for(OchSignal inSig : curLTP.inSignalList)
		{
			if(null != prevLTP)
			{
        		if(inSig.Src.ltpLabel == prevLTP.ltpLabel)
        		{
        			curInSigTrail.add(inSig);
        		}
			}
			else
			{
				curInSigTrail.add(null);
			}
		}
	}	
	
	private void printSignalCalculated(MyLTP curLTP, OchSignal outSigCalculated, OchSignal inSig)
	{
		System.out.println("Cur LTP: " + curLTP.ltpLabel);
		System.out.println("Cur LTP: " + curLTP.ltpType);
		System.out.println("Cur LTP length: " + String.valueOf(curLTP.length));
		System.out.println("Cur LTP loss: " + String.valueOf(curLTP.loss));
		System.out.println("Cur LTP gain: " + String.valueOf(curLTP.gain));
		System.out.println("Cur LTP NF: " + String.valueOf(curLTP.NF));
		System.out.println("Cur LTP Power: " + String.valueOf(curLTP.power));
		
		if(null != inSig)
		{
			//inSig.printOchSignal("Input");
		}
		
		else {System.out.println("InSignal : Null");}

		outSigCalculated.printOchSignal("Calculated Output");
	}
	
	private void printDataForRouteTobeAssessed(Route curRoute, int tdInd)
	{
		System.out.println(curRoute.Route.toString());
    	
    	DecimalFormat decForm = new DecimalFormat("###.##");
    	
    	System.out.println("AB: Rx Osnr = "+String.valueOf(decForm.format(curRoute.RouteOsnr)) + "(dB)");
    	System.out.println("BA: Rx Osnr = "+String.valueOf(decForm.format(curRoute.RouteBAosnr)) + "(dB)");
    	System.out.println("Route Length = "+String.valueOf(decForm.format(curRoute.RouteLength)) + "(km)");
    	String curRouteLinkLabelList = "";
    	for(int i = 0; i < curRoute.RouteByLinks.size(); i++)
    	{
    		NetEdge curEdge = curRoute.RouteByLinks.get(i);
    		curRouteLinkLabelList += curEdge.label + "\t";
    		System.out.println("\n"+curEdge.label + " : operating  TD IDs : " + curEdge.operTDindList.toString());
    		for(int j = 0; j < curEdge.operTDindList.size(); j++)
    		{
    			int tmpAdjTDind = curEdge.operTDindList.get(j);
    			if(j!=tdInd)
    			{
	    			double tmpdf = this.gridDF*Math.abs(curRoute.FreqIndex-this.tdList[tmpAdjTDind].OperationalRoute.FreqIndex);
	    			double bwDf = tmpdf - this.gridDF*(this.tdList[tdInd].Width/2.0+this.tdList[tmpAdjTDind].Width/2.0);
	    			System.out.println("Adj TD ID: "+String.valueOf(tmpAdjTDind)+" ; ch centers df = "+ String.valueOf(decForm.format(tmpdf)) + "(GHz); ch BW df = " + String.valueOf(decForm.format(bwDf))+"(GHz)");
    			}
    		}
    	}
    	//System.out.println("\n"+curRouteLinkLabelList);
	}
	
	public void assessRoute(int tdInd, int routeId)// gets TD and route indices
	{
		 long startTime = System.currentTimeMillis();
		 
		ArrayList<Route> curTDrouteList = this.tdList[tdInd].RouteList; 
        if(-1 < routeId && routeId < curTDrouteList.size())
        {
        	Route curRoute = curTDrouteList.get(routeId);
        	
        	this.printDataForRouteTobeAssessed(curRoute, tdInd);
        	
        	ArrayList<OchSignal> curOutSigTrail = new ArrayList<OchSignal>();
        	ArrayList<OchSignal> curInSigTrail = new ArrayList<OchSignal>();
        	ArrayList<OchSignal> curOutSigBAtrail = new ArrayList<OchSignal>();
        	ArrayList<OchSignal> curInSigBAtrail = new ArrayList<OchSignal>();
        	
        	int routeLTPcount =curRoute.RouteByNodes.size();
        	
        	for(int i = 0; i < routeLTPcount; i++)
        	{
            	MyLTP curLTP = curRoute.RouteByNodes.get(i).ndLTPlist.get(0);
            	MyLTP nextLTP = i < routeLTPcount-1 ? curRoute.RouteByNodes.get(i+1).ndLTPlist.get(0) : null;
        		MyLTP prevLTP = 0 < i ? curRoute.RouteByNodes.get(i-1).ndLTPlist.get(0) : null;
        		
        		this.buildOutputOchSignalTrail(curOutSigTrail,curLTP,nextLTP);
        		this.buildInputOchSignalTrail(curInSigTrail,curLTP,prevLTP);
        	}
        	
        	for(int i = routeLTPcount-1; i >-1; i--)// calculating reverse route
        	{
            	MyLTP curLTP = curRoute.RouteByNodes.get(i).ndLTPlist.get(0);
        		MyLTP nextBAltp = 0 < i ? curRoute.RouteByNodes.get(i-1).ndLTPlist.get(0) : null;
        		MyLTP prevBAltp =  i < routeLTPcount-1 ? curRoute.RouteByNodes.get(i+1).ndLTPlist.get(0) : null;
        		       		
        		this.buildOutputOchSignalTrail(curOutSigBAtrail,curLTP,nextBAltp);
        		this.buildInputOchSignalTrail(curInSigBAtrail,curLTP,prevBAltp);
        	}
        	OchSignal inSigCalculated = null;
        	OchSignal outSigCalculated = null;
        	OchSignal inBAsigCalculated = null;
        	OchSignal outBAsigCalculated = null;
        	
        	ArrayList<OchSignal> outSigTrailCalculated = new ArrayList<OchSignal>();
        	ArrayList<OchSignal> outSigBAtrailCalculated = new ArrayList<OchSignal>();
        	
        	for(int i = 0; i < curInSigTrail.size(); i++) 
        	{
        		OchSignal inSig = curInSigTrail.get(i);
        		OchSignal outSig = curOutSigTrail.get(i);
        		
        		MyLTP curLTP = curRoute.RouteByNodes.get(i).ndLTPlist.get(0);
        		
        		outSigCalculated = curLTP.calcOutSignal(inSigCalculated, curRoute.FreqIndex);
        		inSigCalculated = outSigCalculated;
        		
        		if(curLTP.ltpType == "oeo"&&outSig.Dst.ltpType=="oeo")
        		{
            		inSigCalculated = null; //this is the input signal for Tx part of oeo 
        		}
        		
        		this.printSignalCalculated(curLTP, outSigCalculated, inSig);
        		
        		if(null != outSig)
        		{
            		outSigCalculated.Src = outSig.Src;
            		outSigCalculated.Dst = outSig.Dst;
        		}
        		else {
        			System.out.println("OutSignal : Null");
        			outSigCalculated.Src = curLTP;
        			outSigCalculated.Dst = null;
        		}
        		
        		outSigTrailCalculated.add(outSigCalculated);
        		
        		OchSignal inBAsig = curInSigBAtrail.get(i);
        		OchSignal outBAsig = curOutSigBAtrail.get(i);
        		
        		MyLTP curBAltp = curRoute.RouteByNodes.get(curInSigTrail.size()-1-i).ndLTPlist.get(0);
        		
        		outBAsigCalculated = curBAltp.calcOutSignal(inBAsigCalculated, curRoute.FreqIndex);
        		inBAsigCalculated = outBAsigCalculated;
        		
        		if(curBAltp.ltpType == "oeo"&&outBAsig.Dst.ltpType=="oeo")
        		{
        			inBAsigCalculated = null; //this is the input signal for Tx part of oeo 
        		}
        		
        		//this.printSignalCalculated(curBAltp, outBAsigCalculated, inBAsig);
        		
        		if(null != outBAsig)
        		{
        			outBAsigCalculated.Src = outBAsig.Src;
        			outBAsigCalculated.Dst = outBAsig.Dst;
        		}
        		else {
        			System.out.println("OutSignal : Null");
        			outBAsigCalculated.Src = curBAltp;
        			outBAsigCalculated.Dst = null;
        		}
        		
        		outSigBAtrailCalculated.add(outBAsigCalculated);
        		
        	}
        	/*
        	for(int i = 0; i < curInSigTrail.size(); i++) 
        	{
        		outSigTrailCalculated.get(i).printOchSignal("Output");
        		
        	}
        	for(int i = 0; i < curInSigTrail.size(); i++) 
        	{
        		outSigBAtrailCalculated.get(i).printOchSignal("Output");
        	}
        	*/
        	System.out.println();
        	outSigTrailCalculated.get(outSigTrailCalculated.size()-1).printOchSignal("Output");
        	outSigBAtrailCalculated.get(outSigBAtrailCalculated.size()-1).printOchSignal("Output");
        }
        else {
        	System.out.println("\n!---Route with given ID does not exist---!");
        }
        
        long endTime = System.currentTimeMillis();
        long dt = endTime - startTime;
        System.out.println("\nAssessment Elapsed Time: "+String.valueOf(dt) + " ms.");
        
	}
	
	public NetEdge[] edgeList;
	public NetNode[] nodeList;
	public ConnectivityRequest[] tdList;
	public int networkCapacity;
	public int maxLinkCapacity;
	public double gridDF;
	
	}

class NetNode// this is upper level node - aggregation of LTPs (e.g. V1-ROADM-N1)
{
	public NetNode(int ndId, String ndLabel,ArrayList<Integer> inConSrcIdList, ArrayList<Integer> outConDstIdList)
	{
		this.ndId = ndId;
		this.ndLabel= ndLabel;
		this.inConSrcIdList = new ArrayList<Integer>();
		this.inConSrcIdList = inConSrcIdList;
		this.outConDstIdList = new ArrayList<Integer>();
		this.outConDstIdList = outConDstIdList;	
		this.length = 0;
		
		ArrayList<MyLTP> curNdLTPlist = new ArrayList<>();
		curNdLTPlist.add(new MyLTP("ltp:"+String.valueOf(this.ndId), this.ndLabel + "_ltp"));// create one empty ltp per node 
		//MyLTP(String myltpID, String ltpLabel,ArrayList<MyLTP> clientLtpList,ArrayList<MyLTP> serverLtpList,ArrayList<OchSignal> inSignalList,ArrayList<OchSignal> outSignalList)
		//MyLTP curLTP = new MyLTP("ltp:"+String.valueOf(ndId),ndLabel+"_ltp",);
		//curNdLTPlist.add(curLTP);
		
		this.ndLTPlist = curNdLTPlist;
	}
	
	public void createLTP(List<NetNode> curNodeList)
	{
		ArrayList<MyLTP> clientLtpList = new ArrayList<MyLTP>();
		ArrayList<MyLTP> serverLtpList = new ArrayList<MyLTP>();
		ArrayList<OchSignal> inSignalList = new ArrayList<OchSignal>();
		ArrayList<OchSignal> outSignalList = new ArrayList<OchSignal>();
		
		for(int i : this.inConSrcIdList)
		{
			MyLTP curClientLTP = curNodeList.get(i).ndLTPlist.get(0);//get ltp of the node which is src for incoming connection
			
			clientLtpList.add(curClientLTP);
			OchSignal curOchSig = new OchSignal();
			curOchSig.Dst = this.ndLTPlist.get(0);
			curOchSig.Src = curClientLTP;
			inSignalList.add(curOchSig);
		}
		for(int i : this.outConDstIdList)
		{
			MyLTP curServerLTP = curNodeList.get(i).ndLTPlist.get(0);//get ltp of the node which is dst for outgoing connection
			
			serverLtpList.add(curServerLTP);
			OchSignal curOchSig = new OchSignal();
			curOchSig.Src = this.ndLTPlist.get(0);
			curOchSig.Dst = curServerLTP;
			outSignalList.add(curOchSig);
		}
		//this.setLTPparams(this.ndLTPlist.get(0));
		this.ndLTPlist.get(0).inSignalList = inSignalList;
		this.ndLTPlist.get(0).outSignalList = outSignalList;
		this.ndLTPlist.get(0).clientLtpList = clientLtpList;
		this.ndLTPlist.get(0).clientLtpList = serverLtpList;
		this.setLTPparams(this.ndLTPlist.get(0));
		
	}
	
	public void printNode()
	{
		System.out.println("\n!-----------Node State after LTP creation------------!");
		System.out.println(this.ndLabel);
		for(MyLTP el: this.ndLTPlist)
		{
			System.out.println("LTP ID: "+ el.myltpID);
			System.out.println("LTP label: "+ el.ltpLabel);
			for (MyLTP curCilentLTP: el.clientLtpList)
			{
				System.out.println("-------from LTP: " + curCilentLTP.ltpLabel);
				for(MyLTP curClientServerLTP : curCilentLTP.serverLtpList)
				{
					System.out.println("--------------to LTP: " + curClientServerLTP.ltpLabel);
				}
				for(OchSignal curClientServerSig : curCilentLTP.outSignalList)
				{
					System.out.println("--------------to LTP: LTP out sig Dst: " + curClientServerSig.Dst.ltpLabel);
				}
			}
			for (MyLTP curServerLTP: el.serverLtpList)
			{
				System.out.println("-------to LTP: " + curServerLTP.ltpLabel);
				for(MyLTP curServerClientLTP : curServerLTP.clientLtpList)
				{
					System.out.println("--------------from LTP: " + curServerClientLTP.ltpLabel);
				}
				for(OchSignal curServerClientSig : curServerLTP.inSignalList)
				{
					System.out.println("--------------from LTP: LTP in sig Src: " + curServerClientSig.Src.ltpLabel);
				}
			}
			
		}
	}
	
	 void setLTPparams(MyLTP curLTP)
	{
		if(curLTP.ltpLabel.contains("fiber"))
		{
			curLTP.length = this.length;
			curLTP.loss = Math.pow(10,0.2*this.length/10);
			curLTP.ltpType = "fiber";
		}
		else if(curLTP.ltpLabel.contains("mdx"))
		{
			curLTP.loss = Math.pow(10,10/10.0);
			curLTP.ltpType = "mdx";
		}
		else if(curLTP.ltpLabel.contains("_Bamp"))
		{
			curLTP.gain = Math.pow(10,10/10.0);// just mdx loss
			if(curLTP.clientLtpList.size() > 0)
			{
				if(curLTP.clientLtpList.get(0).length > 1)
				{
					curLTP.gain *=curLTP.clientLtpList.get(0).loss;
				}
			}
			curLTP.NF = 6;
			curLTP.ltpType = "amp";
		}
		else if(curLTP.ltpLabel.contains("_Pamp"))
		{
			curLTP.gain =  Math.pow(10,10/10.0);
			curLTP.gain*= curLTP.clientLtpList.size() > 0 ? curLTP.clientLtpList.get(0).loss : 1;//client is supposed to be a fiber; product because it is in SI units
			curLTP.NF = 6;
			curLTP.ltpType = "amp";
		}
		else if(curLTP.ltpLabel.contains("_amp"))
		{
			curLTP.gain =  Math.pow(10,10/10.0);
			curLTP.NF = 6;
			curLTP.ltpType = "amp";
		}
		else if (curLTP.ltpLabel.contains("ETY") && false == curLTP.ltpLabel.contains("oeo"))
		{
			curLTP.power = 0.001;
			curLTP.ltpType = "ETY";
		}
		else if ( curLTP.ltpLabel.contains("oeo"))
		{
			curLTP.power = 0.001;
			curLTP.ltpType = "oeo";
		}
	}
	
public int ndId;
public String ndLabel;
public ArrayList<Integer> inConSrcIdList;//sources of incoming connections
public ArrayList<Integer> outConDstIdList;//destinations for the outgoing connections
public ArrayList<MyLTP> ndLTPlist;// list of cards (devices) within nodes 
public double length;// for now it is required to test alg 

}

class MyLTP
{

	public MyLTP(String myltpID, String myltpLabel)
	{
		this.myltpID = myltpID;
		this.ltpLabel = myltpLabel;
		this.clientLtpList = new ArrayList<MyLTP>();
		
		this.serverLtpList = new ArrayList<MyLTP>();
		
		this.inSignalList = new ArrayList<OchSignal>();
		
		this.outSignalList = new ArrayList<OchSignal>();
		this.length = 0;
		this.loss = 1;
		this.gain = 1;
		this.NF = -1;
		this.power = 0;
		this.ltpType = "ROADM";
		
		
	}
	public String myltpID;
	public String ltpLabel;
	public ArrayList<MyLTP> clientLtpList;//from client to current
	public ArrayList<MyLTP> serverLtpList;//from current to server
	public ArrayList<OchSignal> inSignalList;
	public ArrayList<OchSignal> outSignalList;
	
	public double length;
	public double loss;
	public double gain;
	public double NF;
	public double power;
	public String ltpType;
	
 	public OchSignal calcOutSignal(OchSignal inSignal,int centerFreq)
	{
		OchSignal curOutSignal = new OchSignal();

		double ccc = 299792458;
		double h = 6.62606896e-34;
		//double alpha = 0.2;
		double fref = ccc/(1.552e-6);
		//double NF = Math.pow(10, 0.1*6.0);
		double noiseIn = h*fref;
		double df= 12.5*Math.pow(10, 9);
		
		if (inSignal != null)
		{
			curOutSignal.centerIndexList.add(centerFreq);
			double noisePsdOut = inSignal.noisePsdList.get(0)*this.gain/this.loss + (this.gain*this.NF+1)*noiseIn;
			curOutSignal.noisePsdList.add(noisePsdOut);
			double powerOut = inSignal.powerList.get(0)*this.gain/this.loss;
			curOutSignal.powerList.add(powerOut);
			curOutSignal.osnrList.add(powerOut/(noisePsdOut*df));
		}
		else
		{
			curOutSignal.centerIndexList.add(centerFreq);
			curOutSignal.noisePsdList.add(noiseIn);
			curOutSignal.powerList.add(this.power);// null input signal - should be start ETY
			curOutSignal.osnrList.add(this.power/(noiseIn*df));
		}
		return curOutSignal;
	}
	
	}



class NetEdge
{
    public NetEdge(double weight, String label, int srcId, int dstId, double linkLength, int linkCapacity,ArrayList<Integer> usedIndices,boolean isoeo) 
    {
        this.goal = dstId; //dstId
        this.weight = weight;
        
        this.label = label;
        this.snId = srcId;
        this.enId = dstId;
        this.length = linkLength;
        this.linkCapacity= linkCapacity;
        this.usedIndices = new ArrayList<Integer>();
        this.usedIndices = usedIndices;
        this.noiseIn = 0;
        this.noiseOut = 0;
        this.operTDindList = new ArrayList<Integer>();
        this.oeo = isoeo;
        this.edgeLTPlist = new ArrayList<MyLTP>();
        
    }
    
	public double calcCurEdgeWeight(double weightIn)// update  weight during path calculation
	{
		//noiseIn = weightIn*h*fref;  
		// several assumptions for now:
		// in noise - h*f
		// amp compensate loss
		// min noise figure 6dB
		// gain = loss
		// attn = 0.2db/km
		//double ccc = 299792458;
		//double h = 6.62606896e-34;
		double alpha = 0.2;
		//double fref = ccc/(1.552e-6);
		double NF = Math.pow(10, 0.1*6.0);
		//double noiseInit = h*fref;
		double curNoiseIn = weightIn < Double.MAX_VALUE ? weightIn : 1.0;
		double gain = Math.pow(10,0.1*alpha*this.length);
		
		//double noiseOut = this.oeo ? 1: Math.pow(10.0,0.1*curNoiseIn)+(NF*gain+1);//input noise is NOT amplified because gain is equal to loss of fiber
		//if edge is just oeo, then no input weight - this will NOT work because here is the cur cumulative weight being searched 
		double noiseOut = this.oeo ? 0*1+1*Math.pow(10.0,0.1*curNoiseIn) :  Math.pow(10.0,0.1*curNoiseIn)+(NF*gain+1);
		
		double curWeight = 10.0*Math.log10(noiseOut);
		if(this.weight < 1 || this.weight > 10000)// user request either to include or exclude link from route
		{
			curWeight = 10.0*Math.log10(Math.pow(10.0,0.1*curNoiseIn)+this.weight);
			//curWeight = this.weight;
		}
		return curWeight;
	}
	
	public double calcCurEdgeNoiseOut(double noiseIn)// update  out noise along with route weight calculated
	{
		//noiseIn = weightIn*h*fref;  
		// several assumptions for now:
		// in noise - h*f
		// amp compensate loss
		// min noise figure 6dB
		// gain = loss
		// attn = 0.2db/km
		// preamp is used only
		double ccc = 299792458;
		double h = 6.62606896*Math.pow(10,-34);
		double alpha = 0.2;
		double fref = ccc/(1.552e-6);
		double NF = this.length==0.0 ? -1 : Math.pow(10, 0.1*6.0);
		//System.out.println("\n"+String.valueOf(NF)+"\n");
		double noiseInit = h*fref;
		double curNoiseIn = noiseIn < Double.MAX_VALUE ? noiseIn : noiseInit;
		double gain = Math.pow(10,0.1*alpha*this.length);
		double loss = Math.pow(10,0.1*alpha*this.length); // gain is equal to fiber loss for now
		
		double noiseOut = this.oeo ? noiseInit : curNoiseIn/loss*gain + (NF*gain+1)*noiseInit;//if edge is just oeo, then no input noise and ASE 
		
		return noiseOut;
	}
	
    public int goal;
    public double weight;
    public String label; // edge (link or OMS) label
    public int snId; //start node ID
    public int enId; // end node ID
    public double length; // typically corresponds to fiber length
    public int linkCapacity; // number of wavelengths allowed in a link might differ from system limit, e.g. 96 indices (for ITUT (100GHz)  are used)
    public ArrayList<Integer> usedIndices;//  wavelength indices occupied within the current link
    public double noiseIn; // for PCA only - weight estimation
    public double noiseOut;// for PCA only - weight estimation
    public ArrayList<Integer>  operTDindList; //list of TDs which routes exist, i.e. TDs are in operational state
    public boolean oeo;
    public ArrayList<MyLTP> edgeLTPlist;// list of cards (devices) within link
    
}

class Location
{
    public Location(int source, double weight) {
        this.source = source;
        this.weight = weight;
        this.linkCapacity = -1;
        this.usedIndices =  new ArrayList<Integer>();
    }
        
    public int source;
    public double weight;
    public int linkCapacity; // number of wavelengths allowed in a link might differ from system limit, e.g. 96 indices (for ITUT (100GHz)  are used)
    public ArrayList<Integer> usedIndices;//  wavelength indices available for the route within the current link
}

class LocationComparator implements Comparator<Integer>
{
    ArrayList<Location> locations = null;

    public LocationComparator(ArrayList<Location> locations)
    {
        this.locations = locations;
    }

    public int compare(Integer item1, Integer item2)
    {
        return Double.compare(locations.get(item1).weight, locations.get(item2).weight);
    }
}
