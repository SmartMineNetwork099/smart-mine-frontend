// ✅ File 4: app/(your-path)/checkout/index.tsx  (main page/component)
"use client";
import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { useWalletAddress } from "@/hooks/useWallet";
import { getUserData } from "@/db/getData";

import MyIncomeCard, { HistoryItem } from "./MyIncomeCard";
import TeamIncomeCard from "./TeamIncomeCard";
import WithdrawHistory from "./WithdrawHistory";

const CheckOut = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();

  const [balance, setBalance] = useState<{ myIncome: number; teamIncome: number }>({
    myIncome: 0,
    teamIncome: 0,
  });
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);

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
        myIncome:  10,
        teamIncome: 10,
      });
      // setBalance({
      //   myIncome: Number.isFinite(my) ? my : 0,
      //   teamIncome: Number.isFinite(team) ? team : 0,
      // });
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

  // ✅ callbacks for MyIncomeCard
  const onWithdrawMyIncome = (amount: number) => {
    setBalance((prev) => ({ ...prev, myIncome: prev.myIncome - amount }));
    setHistory((prev) => [
      { date: new Date().toLocaleString(), amount, status: "Withdraw Completed", type: "myIncome" },
      ...prev,
    ]);
  };

  const onSendMyIncome = ({ amount, userId }: { amount: number; userId: string }) => {
    setBalance((prev) => ({ ...prev, myIncome: prev.myIncome - amount }));
    setHistory((prev) => [
      { date: new Date().toLocaleString(), amount, status: `Sent to ${userId}`, type: "myIncome" },
      ...prev,
    ]);
  };

  // ✅ callbacks for TeamIncomeCard
  const onWithdrawTeam = (amount: number) => {
    setBalance((prev) => ({ ...prev, teamIncome: prev.teamIncome - amount }));
    setHistory((prev) => [
      {
        date: new Date().toLocaleString(),
        amount,
        status: "Withdraw Completed",
        type: "teamIncome",
      },
      ...prev,
    ]);
  };

  const onSendTeam = ({ amount, userId }: { amount: number; userId: string }) => {
    setBalance((prev) => ({ ...prev, teamIncome: prev.teamIncome - amount }));
    setHistory((prev) => [
      { date: new Date().toLocaleString(), amount, status: `Sent to ${userId}`, type: "teamIncome" },
      ...prev,
    ]);
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
        <MyIncomeCard
          myIncome={balance.myIncome}
          loadingBalance={loadingBalance}
          onWithdraw={onWithdrawMyIncome}
          onSend={onSendMyIncome}
        />

        <TeamIncomeCard
          teamIncome={balance.teamIncome}
          loadingBalance={loadingBalance}
          onWithdraw={onWithdrawTeam}
          onSend={onSendTeam}
        />

        {/* optional history */}
        <WithdrawHistory items={history} />
      </div>
    </>
  );
};

export default CheckOut;