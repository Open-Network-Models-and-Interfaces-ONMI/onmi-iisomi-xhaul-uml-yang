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
package org.opendaylight.mwtn.opmalgorithm;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.PriorityQueue;
import java.text.DecimalFormat;
import java.util.PriorityQueue;

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
		this.ndLTPlist.get(0).serverLtpList = serverLtpList;
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
					curRoute.RouteByLinksReverse.add(tmpEdge);

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

	public ArrayList<ArrayList<NetEdge>> excludeEdgesForAltRoutes(LinkedList<NetEdge> primaryRoute)
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


    public LinkedList<Integer> shortest_path(ArrayList<ArrayList<NetEdge>> graph, ConnectivityRequest curTD)
    {
    	int source = curTD.SrcNdId;
    	int goal = curTD.DstNdId;
    	//int curTDrouteListSize = curTD.RouteList.size();
    	//----------------------------------------
    	int CurTDind = -1;

    	boolean duplicate = false;

    	int MaxNumberOfIndices = this.networkCapacity < this.maxLinkCapacity ? this.networkCapacity : this.maxLinkCapacity;

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
    	ArrayList<String> routeDependency = new ArrayList<String>();
    	 double startTime = System.currentTimeMillis();
    	getDependency(curRoute.RouteByLinks.size()-1,curRoute,routeDependency,0);
		 double endTime = System.currentTimeMillis();
         double dt = endTime - startTime;
    	System.out.println("\n"+"Dependency Tree: "+routeDependency);
    	System.out.println("\nDependency calc Time: "+String.valueOf(dt) + " ms.");

    	Route curRouteBAversion = curRoute.createBAversion(curRoute);
    	ArrayList<String> routeBAversionDependency = new ArrayList<String>();
    	getDependency(curRouteBAversion.RouteByLinks.size()-1,curRouteBAversion,routeBAversionDependency,0);
    	System.out.println("\n"+"Revers route - Dependency Tree: "+routeBAversionDependency);
	}

	public void getDependency(int lnkInd,Route curRoute, ArrayList<String> lnkList, int dirFlag)
	{
		if(lnkInd<0)
		return;

		NetEdge curLnkInRoute = curRoute.RouteByLinks.get(lnkInd);
		if(1 == dirFlag)//backward
		{
			curLnkInRoute = curRoute.RouteByLinksReverse.get(lnkInd);
		}

		String tmpStr = curLnkInRoute.label;// + ":";//":("+String.valueOf(curRoute.FreqIndex)+"):";
		/*
		if (curRoute.RouteByLinks.contains(curLnkInRoute))
		{
			tmpStr += "forward";
		}
		else if(curRoute.RouteByLinksReverse.contains(curLnkInRoute))
		{
			tmpStr +="backward";
		}
		else
		{
			tmpStr +="NA";
		}
		*/
		if(false == lnkList.contains(tmpStr))
		{
			lnkList.add(0,tmpStr);
		}

		for(int i = 0; i < curLnkInRoute.operTDindList.size(); i++)
		{
			int tmpAdjTDind = curLnkInRoute.operTDindList.get(i);
			int adjDirFlag = 0;
			Route tmpAdjRoute = this.tdList[tmpAdjTDind].OperationalRoute;
			int adjLnkInd = tmpAdjRoute.RouteByLinks.size()-1;

			if(tmpAdjRoute.RouteByLinks.contains(curLnkInRoute))//forward route contains cur lnk
			{
				adjLnkInd = tmpAdjRoute.RouteByLinks.indexOf(curLnkInRoute);
			}
			else if(tmpAdjRoute.RouteByLinksReverse.contains(curLnkInRoute))//reverse route contains cur lnk
			{
				adjLnkInd = tmpAdjRoute.RouteByLinksReverse.indexOf(curLnkInRoute);
				adjDirFlag = 1;
			}

			getDependency(adjLnkInd-1,tmpAdjRoute,lnkList,adjDirFlag);

		}
		getDependency(lnkInd-1,curRoute,lnkList,dirFlag);// if used w/o for loop above - returns links for cur route
		//for loop above should return dependency tree
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