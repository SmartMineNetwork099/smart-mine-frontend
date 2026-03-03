"use client";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosSend, IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import Card from "@/components/Card";
import { Input } from "rizzui/input";
import { Button } from "rizzui/button";
import { useWalletAddress } from "@/hooks/useWallet";
import { getUserData } from "@/db/getData";
import { BiMoneyWithdraw } from "react-icons/bi";

interface HistoryItem {
  date: string;
  amount: number;
  status: string;
  type: "myIncome" | "teamIncome";
}

const sanitizeDecimal4 = (value: string) => {
  let v = value;

  if (v === "") return "";

  // keep digits + dot only
  v = v.replace(/[^\d.]/g, "");

  // only one dot
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }

  // limit to 4 digits after decimal
  const [intPart, decPart] = v.split(".");
  if (decPart !== undefined) v = `${intPart}.${decPart.slice(0, 4)}`;

  return v;
};

const CheckOut = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();

  // ✅ balances (separate keys)
  const [balance, setBalance] = useState<{ myIncome: number; teamIncome: number }>({
    myIncome: 0,
    teamIncome: 0,
  });

  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);

  // ✅ separate withdraw inputs
  const [withdrawAmountMy, setWithdrawAmountMy] = useState<string>("");
  const [withdrawAmountTeam, setWithdrawAmountTeam] = useState<string>("");

  const [history, setHistory] = useState<HistoryItem[]>([
    { date: "12/12/20", amount: 100, status: "Completed", type: "myIncome" },
    { date: "12/12/20", amount: 50, status: "Completed", type: "teamIncome" },
  ]);

  const handleWalletDataFetch = async () => {
    if (!walletAddress) return;

    try {
      setLoadingBalance(true);

      const localUser: any = await getUserData(walletAddress);

      const my = Number(localUser?.wallet?.balance?.myIncome ?? 0);
      const team = Number(localUser?.wallet?.balance?.teamIncome ?? 0);

      setBalance({
        myIncome: Number.isFinite(my) ? my : 0,
        teamIncome: Number.isFinite(team) ? team : 0,
      });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setBalance({ myIncome: 0, teamIncome: 0 });
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;
    handleWalletDataFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const handleBack = () => router.push(ROUTES?.STACKING?.DASHBOARD);

  // =========================
  // ✅ MY INCOME computed flags
  // =========================
  const amtMy = useMemo(() => parseFloat(withdrawAmountMy), [withdrawAmountMy]);

  const isInvalidAmountMy = useMemo(() => {
    return !withdrawAmountMy || Number.isNaN(amtMy) || amtMy <= 0;
  }, [withdrawAmountMy, amtMy]);

  const isInsufficientMy = useMemo(() => {
    return !Number.isFinite(balance.myIncome) || (!Number.isNaN(amtMy) && amtMy > balance.myIncome);
  }, [balance.myIncome, amtMy]);

  const isWithdrawDisabledMy = useMemo(() => {
    return loadingBalance || isInvalidAmountMy || isInsufficientMy;
  }, [loadingBalance, isInvalidAmountMy, isInsufficientMy]);

  const handleWithdrawMyIncome = () => {
    const a = parseFloat(withdrawAmountMy);

    if (!withdrawAmountMy || Number.isNaN(a) || a <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (a > balance.myIncome) {
      alert("Insufficient balance.");
      return;
    }

    setBalance((prev) => ({ ...prev, myIncome: prev.myIncome - a }));
    setHistory((prev) => [
      { date: new Date().toLocaleString(), amount: a, status: "Completed", type: "myIncome" },
      ...prev,
    ]);
    setWithdrawAmountMy("");
  };
  const handleSendMyIncome = () => {
    const a = parseFloat(withdrawAmountMy);

    if (!withdrawAmountMy || Number.isNaN(a) || a <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (a > balance.myIncome) {
      alert("Insufficient balance.");
      return;
    }

    setBalance((prev) => ({ ...prev, myIncome: prev.myIncome - a }));
    setHistory((prev) => [
      { date: new Date().toLocaleString(), amount: a, status: "Completed", type: "myIncome" },
      ...prev,
    ]);
    setWithdrawAmountMy("");
  };

  // ===========================
  // ✅ TEAM INCOME computed flags
  // ===========================
  const amtTeam = useMemo(() => parseFloat(withdrawAmountTeam), [withdrawAmountTeam]);

  const isInvalidAmountTeam = useMemo(() => {
    return !withdrawAmountTeam || Number.isNaN(amtTeam) || amtTeam <= 0;
  }, [withdrawAmountTeam, amtTeam]);

  const isInsufficientTeam = useMemo(() => {
    return (
      !Number.isFinite(balance.teamIncome) ||
      (!Number.isNaN(amtTeam) && amtTeam > balance.teamIncome)
    );
  }, [balance.teamIncome, amtTeam]);

  const isWithdrawDisabledTeam = useMemo(() => {
    return loadingBalance || isInvalidAmountTeam || isInsufficientTeam;
  }, [loadingBalance, isInvalidAmountTeam, isInsufficientTeam]);

  const handleWithdrawTeamIncome = () => {
    const a = parseFloat(withdrawAmountTeam);

    if (!withdrawAmountTeam || Number.isNaN(a) || a <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (a > balance.teamIncome) {
      alert("Insufficient balance.");
      return;
    }

    setBalance((prev) => ({ ...prev, teamIncome: prev.teamIncome - a }));
    setHistory((prev) => [
      { date: new Date().toLocaleString(), amount: a, status: "Completed", type: "teamIncome" },
      ...prev,
    ]);
    setWithdrawAmountTeam("");
  };
  const handleSendTeamIncome = () => {
    const a = parseFloat(withdrawAmountTeam);

    if (!withdrawAmountTeam || Number.isNaN(a) || a <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (a > balance.teamIncome) {
      alert("Insufficient balance.");
      return;
    }

    setBalance((prev) => ({ ...prev, teamIncome: prev.teamIncome - a }));
    setHistory((prev) => [
      { date: new Date().toLocaleString(), amount: a, status: "Completed", type: "teamIncome" },
      ...prev,
    ]);
    setWithdrawAmountTeam("");
  };

  return (
    <>
      {/* header */}
      <div className="flex gap-2 items-center mb-4">
        <IoMdArrowRoundBack className="cursor-pointer text-4xl text-white" onClick={handleBack} />
        <p className="font-semibold sm:font-bold text-xl sm:text-3xl text-white">
          <span className="text-green-500">Withdraw</span>
        </p>
      </div>

      <div className="space-y-4">
        {/* ===================== MY INCOME CARD ===================== */}
        <Card className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-[100%] sm:w-[60%]">
              <p className="text-white text-base sm:text-xl">
                My Income :{" "}
                <span
                  className={`text-xl font-black ${
                    balance.myIncome <= 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  $ {loadingBalance ? "Loading..." : balance.myIncome.toLocaleString()}
                </span>
              </p>

              <div className="mt-2">

                <Input
                  type="text"
                  inputMode="decimal"
                  value={withdrawAmountMy}
                  onChange={(e) => setWithdrawAmountMy(sanitizeDecimal4(e.target.value))}
                  placeholder="0.0000"
                  className="bg-neutral-800 text-green-500 ring-0 border-0 outline-none rounded-md"
                  inputClassName="h-12 py-2 px-4 text-lg ring-0 border-0 outline-none"
                />

                {withdrawAmountMy && !Number.isNaN(amtMy) && amtMy > balance.myIncome && (
                  <p className="text-red-400 text-sm mt-2">Insufficient balance.</p>
                )}
                <div className="flex items-center gap-2">
                <Button
                  disabled={isWithdrawDisabledMy}
                  className={`mt-4 flex items-center gap-2 w-full text-lg font-bold border-0 transition-all duration-200 ${
                    isWithdrawDisabledMy
                      ? "bg-green-300 text-green-900 cursor-not-allowed opacity-70"
                      : "bg-green-500 text-black hover:bg-green-600"
                  }`}
                  onClick={handleWithdrawMyIncome}
                >
                  Withdraw <span className="text-xl"><BiMoneyWithdraw  /></span> 
                </Button>
                <Button
                  disabled={isWithdrawDisabledMy}
                  className={`mt-4 w-full flex items-center gap-2 text-lg font-bold border-0 transition-all duration-200 ${
                    isWithdrawDisabledMy
                      ? "bg-green-300 text-green-900 cursor-not-allowed opacity-70"
                      : "bg-green-500 text-black hover:bg-green-600"
                  }`}
                  onClick={handleSendMyIncome}
                >
                 Send <span className="text-xl"><IoIosSend /></span> 
                </Button>

                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ===================== TEAM INCOME CARD ===================== */}
        <Card className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-[100%] sm:w-[60%]">
              <p className="text-white text-base sm:text-xl">
                Team Income :{" "}
                <span
                  className={`text-xl font-black ${
                    balance.teamIncome <= 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  $ {loadingBalance ? "Loading..." : balance.teamIncome.toLocaleString()}
                </span>
              </p>

              <div className="mt-2">

                <Input
                  type="text"
                  inputMode="decimal"
                  value={withdrawAmountTeam}
                  onChange={(e) => setWithdrawAmountTeam(sanitizeDecimal4(e.target.value))}
                  placeholder="0.0000"
                  className="bg-neutral-800 text-green-500 ring-0 border-0 outline-none rounded-md"
                  inputClassName="h-12 py-2 px-4 text-lg ring-0 border-0 outline-none"
                />

                {withdrawAmountTeam && !Number.isNaN(amtTeam) && amtTeam > balance.teamIncome && (
                  <p className="text-red-400 text-sm mt-2">Insufficient balance.</p>
                )}

               <div className="flex items-center gap-2">
                 <Button
                  disabled={isWithdrawDisabledTeam}
                  className={`mt-4 w-full flex items-center gap-2 text-lg font-bold border-0 transition-all duration-200 ${
                    isWithdrawDisabledTeam
                      ? "bg-green-300 text-green-900 cursor-not-allowed opacity-70"
                      : "bg-green-500 text-black hover:bg-green-600"
                  }`}
                  onClick={handleWithdrawTeamIncome}
                >
              Withdraw  <span className="text-xl"><BiMoneyWithdraw  /></span> 
                  
                </Button>
                 <Button
                  disabled={isWithdrawDisabledTeam}
                  className={`mt-4 w-full flex items-center gap-2 text-lg font-bold border-0 transition-all duration-200 ${
                    isWithdrawDisabledTeam
                      ? "bg-green-300 text-green-900 cursor-not-allowed opacity-70"
                      : "bg-green-500 text-black hover:bg-green-600"
                  }`}
                  onClick={handleSendTeamIncome}
                >
                 Send <span className="text-xl"><IoIosSend /></span> 
                </Button>
               </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* history (optional) */}
      {/* <Card className="max-w-4xl mx-auto p-6 mt-4">
        <h2 className="text-green-500 text-lg font-semibold mb-2">Withdrawal History</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {history.length ? (
            history.map((item, idx) => (
              <div key={idx} className="flex justify-between px-3 py-2 bg-neutral-800 rounded text-white">
                <span className="text-sm">{item.date} ({item.type})</span>
                <span className="text-md">$ {item.amount}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No withdrawals yet</p>
          )}
        </div>
      </Card> */}
    </>
  );
};

export default CheckOut;