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

			  tmpLinkLabelList.add(el);
			  tmpLinkLengthList.add(curLength);


			  //extension of edges to LTPs
			  /*
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
			  */
			//end of extension of edges to LTPs

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