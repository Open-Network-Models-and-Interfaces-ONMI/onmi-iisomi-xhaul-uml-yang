/*
 * Copyright © 2018 sendate.eu and others.  All rights reserved.
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
import java.text.DecimalFormat;

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
		this.RouteByLinksReverse = new LinkedList<NetEdge>();
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
		this.RouteByLinksReverse = new LinkedList<NetEdge>();
		this.FreqIndex = FreqIndex;
		this.RouteCumulativeWeight = 0;
		this.RouteNoise = 0;
		this.RouteBAnoise = 0;
		this.RouteOsnr = 58;//dB uinits
		this.RouteBAosnr = 58;
		this.RouteLTPlist = new ArrayList<MyLTP>();
	}
	
	public Route createBAversion(Route curRoute)
	{
		Route curRouteBAversion = new Route();
		curRouteBAversion.RouteLength = curRoute.RouteLength;
		curRouteBAversion.RouteWeight = curRoute.RouteWeight;
		curRouteBAversion.RouteCumulativeWeight = curRoute.RouteCumulativeWeight;
		curRouteBAversion.RouteNoise = curRoute.RouteBAnoise;
		curRouteBAversion.RouteBAnoise = curRoute.RouteNoise;
		curRouteBAversion.RouteOsnr = curRoute.RouteBAosnr;
		curRouteBAversion.RouteBAosnr = curRoute.RouteOsnr;
		curRouteBAversion.FreqIndex = curRoute.FreqIndex;
		
		curRouteBAversion.RouteByLinks = curRoute.RouteByLinksReverse;
		curRouteBAversion.RouteByLinksReverse = curRoute.RouteByLinks;
		
		for(int i = 0; i < curRoute.RouteByNodes.size(); i++)
		{
			curRouteBAversion.RouteByNodes.add(0,curRoute.RouteByNodes.get(i));
			curRouteBAversion.Route.add(0,curRoute.Route.get(i));
		}
		
		return curRouteBAversion;
	}
	
	LinkedList<Integer> Route; //list of node ids
	double RouteLength;
	double RouteWeight;
	LinkedList<NetNode> RouteByNodes;
	LinkedList<NetEdge> RouteByLinks;
	LinkedList<NetEdge> RouteByLinksReverse;
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
			
			System.out.print("Reverse Route Link Labels: ");
			
			tmpStr = "";
			for (NetEdge lnk : el.RouteByLinksReverse)
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
	
    public ArrayList<ArrayList<NetEdge>> prepareDijkstraGraph(NetEdge[] EdgeList, ArrayList<NetEdge> EdgeToExcludeList)
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
            
            for(NetEdge el : this.LinksToExclude)// this is user request - high priority
            {
            	if(el.label == v0.label)
            	{
            		v0.weight +=10000; 
            		break;
            	}
            }
            for(NetEdge el : this.LinksToInclude)// this is user request - high priority - can overwrite alg request
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