import { ethers } from "ethers";
import "sf-font";
import daoABI from "../components/daoABI.json";
import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "easymde/dist/easymde.min.css";
import Image from "next/image";

import { daoContract, daosmartc, daopropurl } from "../components/config";

import {
  checkNFTs,
  getProposal,
  addChoice,
  submitProptoDB,
  ethConnect,
  submitNoFeeProp,
} from "../components/interfaces";

const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const WalletSol = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Proposal() {
  const [solnft, getSolNftCount] = useState(0);
  const [content, setContent] = useState("");
  const [choicenum, getNumChoice] = useState([]);

  const { publicKey } = useWallet();

  useEffect(() => {
    verifyNFTs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  async function verifyNFTs() {
    if (publicKey === null) {
      return;
    }
    if (choicenum.length === 0) {
      let message1 = "Please fill proposal before connecting wallet.";
      let message2 = "Refreshing Page...";
      document.getElementById("displayresult1").innerHTML = message1;
      await new Promise((r) => setTimeout(r, 3000));
      document.getElementById("displayresult2").innerHTML = message2;
      await new Promise((r) => setTimeout(r, 3000));
      window.location.reload();
    }
    const pubkey = publicKey.toBase58();
    const data = checkNFTs(pubkey);
    data.then((value) => {
      getSolNftCount(value);
      if (publicKey != null) {
        if (value === 0) {
          let message1 = "Sorry, You do not hold NFTs!";
          let message2 =
            "You need to own at least 1 PF Club NFT to submit proposals.";
          document.getElementById("displayresult1").innerHTML = message1;
          document.getElementById("displayresult2").innerHTML = message2;
          return;
        } else {
          addPropButton();
        }
      }
    });
  }

  async function addPropButton() {
    let container = document.getElementById("proposalbutton");
    let btn = document.createElement("button");
    btn.innerHTML = "Submit Proposal";
    btn.className =
      "block w-full rounded-md border-gray-300 pl-7 w-1/3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-blue-100";
    btn.onclick = submitProp;
    container.appendChild(btn);
  }

  async function submitProp() {
    if (publicKey == null) {
      return;
    }
    const pubkey = publicKey.toBase58();
    //const data = await checkNFTs(pubkey);
    const data = 25;
    console.log(data)
    getSolNftCount(data);
    if (data < 25) {
      let message3 = "Submitting proposal to blockchain, Standby....";
      document.getElementById("displayresult1").innerHTML = message3;
      submitPropFee();
    } else {
      submitPropNoFee();
    }
  }

  async function submitPropFee() {
    const output = await ethConnect();
    const addresstr = output.addresstr;
    await new Promise((r) => setTimeout(r, 1000));
    const propTitle = document
      .querySelector("[name=proposaltitle]")
      .value.toString();
    const days = Number(document.querySelector("[name=days]").value.toString());
    const contract = new ethers.Contract(daoContract, daoABI, output.signer);
    const propidraw = await contract.currentProposalId();
    const propId = Number(propidraw) + 1;
    let message2 = "Awaiting Proposal Fee Payment, Standing By..";
    document.getElementById("displayresult1").innerHTML = message2;
    await new Promise((r) => setTimeout(r, 2000));
    const propfeeraw = await contract.propFee();
    //const propfee = Number(propfeeraw);
    const tx1 = await contract
      .openProp(days, propTitle, choicenum, {
        value: propfeeraw, gasPrice: output.gasfee})
      .catch((error) => {
        console.log(error)
        return;
      });

    if (tx1 == undefined) {
    const feeout = (ethers.utils.formatEther(propfeeraw)).toString();
      let message1 = "Transaction Reverted, Canceled by user or not enough funds, proposal fee cost:" + feeout + " MATIC";
      document.getElementById("displayresult1").innerHTML = message1;
      return;
    }
    let receipt = await tx1.wait();
    if (receipt) {
      let message3 = "Proposal Received, Registering in DAO.. ";
      document.getElementById("displayresult1").innerHTML = message3;
    } else {
      console.log("Error submitting transaction");
    }
    const theme = "#1E2F9770";
    const origin = "Community";
    const proposal = await getProposal(propId);
    const enddate = proposal.end;
    let mongocall = await submitProptoDB(
      propId,
      propTitle,
      choicenum,
      content,
      addresstr,
      days,
      theme,
      origin,
      enddate
    );
    if (mongocall == "complete") {
      for (let i = 0; i < choicenum; i++) {
        let num = (i + 1).toString();
        let choiceres = document.getElementById("choice" + num).value;
        await new Promise((r) => setTimeout(r, 1000));
        await addChoice(propId, i, choiceres);
      }
    }
    let message4 = "Completed Successfully Prop Id: #" + propId;
    document.getElementById("displayresult1").innerHTML = message4;
    let container = document.getElementById("displayresult3");
    let a = document.createElement("a");
    a.setAttribute("href", daopropurl + propId);
    a.innerHTML = "Proposal: " + propId;
    a.style.color = "#04d9ff";
    container.appendChild(a);
  }

  async function submitPropNoFee() {
    const output = await ethConnect();
    await new Promise((r) => setTimeout(r, 1000));
    const propTitle = document
      .querySelector("[name=proposaltitle]")
      .value.toString();
    const days = Number(document.querySelector("[name=days]").value.toString());
    const contract = new ethers.Contract(daoContract, daoABI, output.signer);
    const propidraw = await contract.currentProposalId();
    const propId = Number(propidraw) + 1;
    let message1 = "Wallet Verified";
    document.getElementById("displayresult1").innerHTML = message1;
    await new Promise((r) => setTimeout(r, 1000));
    let message3 = "Submitting proposal to blockchain, Standby....";
    document.getElementById("displayresult1").innerHTML = message3;
    const tx1 = await submitNoFeeProp(days, propTitle, choicenum);
    if (tx1 == "complete") {
      let message3 = "Proposal in DAO! Standby... " + propId;
      document.getElementById("displayresult1").innerHTML = message3;
    } else {
      console.log("Error submitting transaction");
    }
    await new Promise((r) => setTimeout(r, 2000));
    const addresstr = output.addresstr;
    const theme = "#1E2F9770";
    const origin = "Community";
    const proposal = await getProposal(propId);
    const enddate = proposal.end;
    const mongocall = await submitProptoDB(
      propId,
      propTitle,
      choicenum,
      content,
      addresstr,
      days,
      theme,
      origin,
      enddate
    );
    if (mongocall == "complete") {
      for (let i = 0; i < choicenum; i++) {
        let num = (i + 1).toString();
        let choiceres = document.getElementById("choice" + num).value;
        await new Promise((r) => setTimeout(r, 1000));
        const mongoupdate = await addChoice(propId, i, choiceres);
        console.log(mongoupdate);
      }
    }
     let message4 = "Completed Successfully Prop Id: #" + propId;
    document.getElementById("displayresult1").innerHTML = message4;
    let container = document.getElementById("displayresult3");
    let a = document.createElement("a");
    a.setAttribute("href", daopropurl + propId);
    a.innerHTML = "Proposal: " + propId;
    a.style.color = "#04d9ff";
    container.appendChild(a);
  }

  function addFields() {
    let number = document.getElementById("member").value;
    if (number < 2 && number > 5) {
      let choiceerror = "Number of choices incorrect: Min 2 - Max 5";
      document.getElementById("choiceerror").innerHTML = choiceerror;
      return;
    }
    let container = document.getElementById("choicecontainer");
    while (container.hasChildNodes()) {
      container.removeChild(container.lastChild);
    }
    for (let i = 0; i < number; i++) {
      let input = document.createElement("input");
      input.type = "text";
      input.name = "choice" + (i + 1);
      input.id = "choice" + (i + 1);
      input.style.marginTop = "2px";
      input.className =
        "block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
      input.placeholder = "Choice " + (i + 1) + " description";
      container.appendChild(input);
      container.appendChild(document.createElement("br"));
    }
    getNumChoice(number);
  }

  return (
    <div>
      <div
        className="flex flex-col flex-auto min-w-100 mb-6"
        style={{
          backgroundImage: `url("/mosaicologo.png")`,
          //minHeight: 100 + "%",
        }}
      >
        <div className="w-full">
          <img src="/backhroundheader.png" style={{ width: "100%" }} />
        </div>

        <div className="flex-col w-full justify-items-center">
          <img
            src="/newproposal.svg"
            style={{ maxWidth: 50 + "%", marginLeft: 25 + "%" }}
          />
        </div>
        <div className="flex flex-row flex-wrap ">
          <div className="w-full p-3">
            <div className="overflow-hidden  overflow-hidden  bg-orange-100 shadow sm:rounded-lg ">
              <div className="bg-orange-300 px-4 py-5 items-center w-full  font-bold text-1xl">
                A community driven DAO proposal. Let your voice and suggestions
                be heard. Submitting your proposal improves this organization.
                Adding your value to the community is essential. Once you submit
                your proposal, thousands of community users will vote to provide
                their input.
              </div>
              <div className="overflow-hidden bg-gray-100 shadow   font-bold text-1xl px-4 py-5 flex flex-col">
                <div>
                  <ul>
                    <li>Step-1 Fill Proposal</li>
                    <li>Step-2 Connect Wallet to Submit</li>
                    <li className="text-center">
                      <WalletSol />
                    </li>
                  </ul>
                </div>
                <div className="w-full text-center mt-4">
                  <button
                    href="#"
                    id="filldetails"
                    className=" rounded-md border border-transparent w-1/3 bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={submitProp}
                  >
                    Submit
                  </button>
                </div>
                <div>
                  <div>
                    <h6 id="displayresult1"></h6>
                    <h6 id="displayresult2"></h6>
                    <h6 id="displayresult3"></h6>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden bg-orange-100 shadow   font-bold text-1xl px-4 py-5 flex flex-row">
                <div className="w-1/3">Titulo</div>
                <div className="w-2/3">
                  <input
                    name="proposaltitle"
                    className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    maxLength="50"
                    required
                  ></input>
                </div>
              </div>
              <div className="overflow-hidden bg-white shadow   font-bold text-1xl px-4 py-5 ">
                <label className="form-label" style={{ color: "black" }}>
                  Proposal Description
                </label>
                <SimpleMdeEditor onChange={(e) => setContent(e)} />
              </div>
              <div className="overflow-hidden bg-orange-100 shadow   font-bold text-1xl px-4 py-5 flex flex-row">
                <div className="w-1/3">Proposal Duration (Min 2 - Max 5)</div>
                <div className="w-2/3">
                  <input
                    placeholder="Min-3 Max-7"
                    type="number"
                    min="3"
                    max="7"
                    name="days"
                    className="w-full"
                    required
                  ></input>
                </div>
              </div>
              <div className="overflow-hidden bg-orange-100 shadow   font-bold text-1xl px-4 py-5 flex flex-row">
                <div className="w-1/3">
                  Proposal Votes Choices (Min 2 - Max 5)
                </div>
                <div className="w-2/3 flex flex-col">
                  <div className="mb-3">
                    <input
                      className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      type="number"
                      id="member"
                      name="member"
                      min="2"
                      max="5"
                    />
                  </div>
                  <div className="mb-3">
                    <button
                      href="#"
                      id="filldetails"
                      className=" rounded-md border border-transparent w-full bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={addFields}
                    >
                      Add Choices
                    </button>
                  </div>
                  <div className="mb-3">
                    <div id="choicecontainer" />
                    <h5 id="choiceerror"></h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "none" }}>
        <main className="py-3 px-3">
          <div className=" text-left">
            <Image
              className="d-block  mb-4"
              src="/pflogo.png"
              alt=""
              width="132"
              height="125"
            />
            <h1 style={{ fontWeight: "bolder" }}>Create new Proposal</h1>
            <p style={{ fontWeight: "200", fontSize: "20px" }}>
              A community driven DAO proposal. Let your voice and suggestions be
              heard. Submitting your proposal improves this organization. Adding
              your value to the community is essential. Once you submit your
              proposal, thousands of community users will vote to provide their
              input.
            </p>
          </div>

          <div className="row g-6 d-flex justify-content-between">
            <div className="col-md-5 col-lg-4 order-md-last">
              <h6 style={{ fontWeight: "300" }}>Step-1 Fill Proposal</h6>
              <h6 style={{ fontWeight: "300" }}>
                Step-2 Connect Wallet to Submit
              </h6>
              <WalletSol />
              <div className="col-md-5">
                <div id="proposalbutton" />
              </div>
              <div className="col-md-8">
                <h6 id="displayresult1"></h6>
                <h6 id="displayresult2"></h6>
                <h6 id="displayresult3"></h6>
              </div>

              <form className="p-2">
                <Link style={{ color: "white" }} href="/proposals">
                  Return to Proposals
                </Link>
              </form>
            </div>
            <div className="col-md-7 col-lg-8">
              <h4 className="mb-3">Proposal Title</h4>
              <form />
              <div className="row g-3">
                <div className="col-sm-6">
                  <input
                    name="proposaltitle"
                    className="form-control"
                    maxLength="50"
                    required
                  ></input>
                </div>
                <div className="col-12">
                  <label className="form-label">Proposal Description</label>
                  <SimpleMdeEditor onChange={(e) => setContent(e)} />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Proposal Vote Choices</label>
                  <h6 className="form-label">Min 2 - Max 5</h6>
                  <input
                    className="form-control"
                    type="number"
                    id="member"
                    name="member"
                    min="2"
                    max="5"
                  />
                  <button
                    href="#"
                    id="filldetails"
                    className="w-100 btn btn-secondary mt-3"
                    style={{
                      color: "black",
                      fontWeight: "bold",
                    }}
                    onClick={addFields}
                  >
                    Add Choices
                  </button>
                </div>

                <div className="col-md-8 p-2">
                  <div id="choicecontainer" />
                  <h5 id="choiceerror"></h5>
                </div>

                <div className="col-6">
                  <label className="">Proposal Duration - In Days</label>
                  <div className="col-md-5">
                    <input
                      placeholder="Min-3 Max-7"
                      type="number"
                      min="3"
                      max="7"
                      name="days"
                      className="form-control"
                      required
                    ></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="my-5 pt-5 text-muted text-center text-small">
          <p style={{ color: "white" }} className="mb-1">
            &copy; 2017–2022 profitfriends.io
          </p>
          <ul className="list-inline">
            <li className="list-inline-item">
              <a href="#">Privacy</a>
            </li>
            <li className="list-inline-item">
              <a href="#">Terms</a>
            </li>
            <li className="list-inline-item">
              <a href="#">Support</a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
