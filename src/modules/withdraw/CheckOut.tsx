"use client";
import React, { useEffect, useMemo, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import Card from "@/components/Card";
import { Input } from "rizzui/input";
import { Button } from "rizzui/button";
import { useWalletAddress } from "@/hooks/useWallet";
import { getUserData } from "@/db/getData";

interface HistoryItem {
  date: string;
  amount: number;
  status: string;
}

const CheckOut = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();

  const [balance, setBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);

  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  const [history, setHistory] = useState<HistoryItem[]>([
    { date: "12/12/20", amount: 100, status: "Completed" },
    { date: "12/12/20", amount: 50, status: "Completed" },
  ]);

  const handleWalletDataFetch = async () => {
    if (!walletAddress) return;

    try {
      setLoadingBalance(true);

      const localUser: any = await getUserData(walletAddress);
      if (localUser) {
        const b = Number(localUser?.wallet?.balance ?? 0);
        setBalance(Number.isFinite(b) ? b : 0);
      } else {
        setBalance(0);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;
    handleWalletDataFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const handleBack = () => {
    router.push(ROUTES?.STACKING?.DASHBOARD);
  };

  // ✅ 4 decimals max
  const handleWithdrawAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let v = e.target.value;

    if (v === "") {
      setWithdrawAmount("");
      return;
    }

    // keep digits + dot only
    v = v.replace(/[^\d.]/g, "");

    // only one dot
    const firstDot = v.indexOf(".");
    if (firstDot !== -1) {
      v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
    }

    // limit to 4 digits after decimal
    const [intPart, decPart] = v.split(".");
    if (decPart !== undefined) {
      v = `${intPart}.${decPart.slice(0, 4)}`;
    }

    setWithdrawAmount(v);
  };

  const amt = useMemo(() => parseFloat(withdrawAmount), [withdrawAmount]);

  const isInvalidAmount = useMemo(() => {
    return !withdrawAmount || Number.isNaN(amt) || amt <= 0;
  }, [withdrawAmount, amt]);

  const isInsufficient = useMemo(() => {
    return !Number.isFinite(balance) || (!Number.isNaN(amt) && amt > balance);
  }, [balance, amt]);

  const isWithdrawDisabled = useMemo(() => {
    return loadingBalance || isInvalidAmount || isInsufficient;
  }, [loadingBalance, isInvalidAmount, isInsufficient]);

  const handleWithdrawClick = () => {
    const a = parseFloat(withdrawAmount);

    // server-side / logic safety checks
    if (!withdrawAmount || Number.isNaN(a) || a <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (!Number.isFinite(balance) || a > balance) {
      alert("Insufficient balance.");
      return;
    }

    // ✅ dummy local update
    setBalance((prev) => prev - a);
    setHistory((prev) => [
      { date: new Date().toLocaleString(), amount: a, status: "Completed" },
      ...prev,
    ]);
    setWithdrawAmount("");
  };

  return (
    <>
      {/* header */}
      <div className="flex gap-2 items-center mb-4">
        <IoMdArrowRoundBack
          className="cursor-pointer text-4xl text-white"
          onClick={handleBack}
        />
        <p className="font-semibold sm:font-bold text-xl sm:text-3xl text-white">
          <span className="text-green-500">Withdraw</span>
        </p>
      </div>

      {/* card container */}
      <Card className="max-w-4xl mx-auto p-6 space-y-10">
        {/* balance + form row */}
        <div className="flex items-center justify-center">
          <div className="w-[100%] sm:w-[60%]">
            <p className="text-white text-base sm:text-xl">
              Total Balance :{" "}
              <span
                className={`text-xl font-black ${
                  balance <= 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                $ {loadingBalance ? "Loading..." : balance.toLocaleString()}
              </span>
            </p>

            <div className="mt-6">
              <label className="block text-gray-300 mb-2">
                Amount to withdraw
              </label>

              <Input
                type="text"
                inputMode="decimal"
                value={withdrawAmount}
                onChange={handleWithdrawAmountChange}
                placeholder="0.0000"
                className="bg-neutral-800 text-green-500 ring-0 border-0 outline-none rounded-md"
                inputClassName="h-12 py-2 px-4 text-lg ring-0 border-0 outline-none"
              />

              {/* optional hint */}
              {withdrawAmount && !Number.isNaN(amt) && amt > balance && (
                <p className="text-red-400 text-sm mt-2"> Insufficient balance</p>
              )}

             <Button
  disabled={isWithdrawDisabled}
  className={`mt-4 w-full font-bold border-0 transition-all duration-200 ${
    isWithdrawDisabled
      ? "bg-green-300 text-green-800 cursor-not-allowed opacity-70"
      : "bg-green-500 text-black hover:bg-green-600"
  }`}
  onClick={handleWithdrawClick}
>
  Withdraw
</Button>
            </div>
          </div>
        </div>

        {/* history */}
        <div className="flex-1">
          <h2 className="text-green-500 text-lg font-semibold mb-2">
            Withdrawal History
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.length ? (
              history.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between px-3 py-2 bg-neutral-800 rounded text-white"
                >
                  <span className="text-sm">{item.date}</span>
                  <span className="text-md">$ {item.amount}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No withdrawals yet</p>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default CheckOut;