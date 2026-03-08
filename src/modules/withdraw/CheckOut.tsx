// ✅ File 4: app/(your-path)/checkout/index.tsx  (main page/component)
"use client";
import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { useWalletAddress } from "@/hooks/useWallet";
import { getUserData } from "@/db/getData";
import { FiAlertTriangle, FiArrowUpRight, FiSend } from "react-icons/fi";
import MyIncomeCard, { HistoryItem } from "./MyIncomeCard";
import TeamIncomeCard from "./TeamIncomeCard";
import ShareIncomeCard from "./ShareIncomeCard";
import { formatAmount, normalizeWalletAddress } from "@/utils/func";
import { shareIncomeApi, withdrawIncomeApi } from "@/apis/withdrawApis";
import { toast } from "react-toastify";
import { roundTo4 } from "@/utils/amount";
import { upsertUserData } from "@/db/saveData";

const CheckOut = () => {
  const router = useRouter();
   let walletAddress = useWalletAddress();
      walletAddress = normalizeWalletAddress(walletAddress)

  const [balance, setBalance] = useState<any>({
    myIncome: 0,
    teamIncome: 0,
    shareIncome: 0,
  });
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const [source, setSource] = useState('');

  const [history, setHistory] = useState<HistoryItem[]>([
    { date: "12/12/20", amount: 100, status: "Completed", type: "myIncome" },
    { date: "12/12/20", amount: 50, status: "Completed", type: "teamIncome" },
  ]);
// withdraw income rules 
  const minimumWithdrawRequiredIncome = process.env.NEXT_PUBLIC_MINIMUM_WIDTHDRAW_INCOME;
// share income rules 
  const minimumShareRequiredIncome = process.env.NEXT_PUBLIC_MINIMUM_SHARE_INCOME;

  const handleWalletDataFetch = async () => {
    if (!walletAddress) return;

    try {
      setLoadingBalance(true);

      const localUser: any = await getUserData(walletAddress);
      const my = formatAmount(localUser?.wallet?.balance?.myIncome ?? 0);
      const team = formatAmount(localUser?.wallet?.balance?.teamIncome ?? 0);
      const share = formatAmount(localUser?.wallet?.balance?.shareIncome ?? 0);

      // setBalance({
      //   myIncome:  10,
      //   teamIncome: 10,
      //   shareIncome:10,
      // });
      setBalance({
        myIncome: my,
        teamIncome: team,
        shareIncome: share,
      });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setBalance({ myIncome: 0, teamIncome: 0 , shareIncome: 0 });
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
  const onWithdrawMyIncome =async (amount: number) => {
    if(loadingBalance) return;
    if (!walletAddress) return;

    if(roundTo4(amount)>roundTo4(balance?.myIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(minimumWithdrawRequiredIncome)){
      toast.error(`minimum withdraw ${minimumWithdrawRequiredIncome}`)
      return;
    }

    const payload = {
      amount,
      source,
    }
    
    const {data , error} = await withdrawIncomeApi(payload);
    if(error){
      toast.error(error)
    }
    console.log(data,'datadatacheckout1111')
      const updatedFields = {
           wallet : data?.wallet,
          }
          await upsertUserData(walletAddress || '', updatedFields);
          handleWalletDataFetch()
  };

  const onSendMyIncome = async({ amount, userId }: { amount: number; userId: string }) => {
       if(loadingBalance) return
       if (!walletAddress) return;

    if(roundTo4(amount)>roundTo4(balance?.myIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(minimumShareRequiredIncome)){
      toast.error(`minimum withdraw ${minimumShareRequiredIncome}`)
      return;
    }
    const payload = {
      receiverId:userId,
      amount,
      source
    }
    const {data , error} = await shareIncomeApi(payload);
    console.log(data,'datadatacheckout1111')
      if(error){
      toast.error(error)
    }
    console.log(data,'datadatacheckout1111')
      const updatedFields = {
           wallet : data?.wallet,
          }
          await upsertUserData(walletAddress || '', updatedFields);
          handleWalletDataFetch()
  };

  // ✅ callbacks for TeamIncomeCard
  const onWithdrawTeam = async(amount: number) => {
  
  if(loadingBalance) return
  if (!walletAddress) return;

    if(roundTo4(amount)>roundTo4(balance?.teamIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(minimumWithdrawRequiredIncome)){
      toast.error(`minimum withdraw ${minimumWithdrawRequiredIncome}`)
      return;
    }

    const payload = {
      amount,
      source,
    }
    
    const {data , error} = await withdrawIncomeApi(payload);
    console.log(data,'datadatacheckout1111')
      if(error){
      toast.error(error)
    }
    console.log(data,'datadatacheckout1111')
      const updatedFields = {
           wallet : data?.wallet,
          }
          await upsertUserData(walletAddress || '', updatedFields);
          handleWalletDataFetch()
  };


  const onSendTeamIncome = async ({ amount, userId }: { amount: number; userId: string }) => {
       if(loadingBalance) return
       if (!walletAddress) return;

    if(roundTo4(amount)>roundTo4(balance?.teamIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(minimumShareRequiredIncome)){
      toast.error(`minimum withdraw ${minimumShareRequiredIncome}`)
      return;
    }
    const payload = {
      receiverId:userId,
      amount,
      source
    }
    const {data , error} = await shareIncomeApi(payload);
    console.log(data,'datadatacheckout1111')
      if(error){
      toast.error(error)
    }
    console.log(data,'datadatacheckout1111')
      const updatedFields = {
           wallet : data?.wallet,
          }
          await upsertUserData(walletAddress || '', updatedFields);
          handleWalletDataFetch()

  };
  const onSendShareIncome = async ({ amount, userId }: { amount: number; userId: string }) => {
     if(loadingBalance) return
     if (!walletAddress) return;

    if(roundTo4(amount)>roundTo4(balance?.shareIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(minimumShareRequiredIncome)){
      toast.error(`minimum withdraw ${minimumShareRequiredIncome}`)
      return;
    }
    const payload = {
      receiverId:userId,
      amount,
      source
    }
    const {data , error} = await shareIncomeApi(payload);
    console.log(data,'datadatacheckout1111')
      if(error){
      toast.error(error)
    }
    console.log(data,'datadatacheckout1111')
      const updatedFields = {
           wallet : data?.wallet,
          }
          await upsertUserData(walletAddress || '', updatedFields);
          handleWalletDataFetch()
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

    {/* /////////////////////////////////////////////////////// */}
 <div className="max-w-4xl mx-auto mb-5 rounded-2xl border border-green-500 p-4 shadow-lg shadow-green-500/20">
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
          <FiAlertTriangle size={20} />
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold tracking-wide text-white">
            Transaction Fee Notice
          </h3>
          <p className="mt-1 text-sm leading-6 text-gray-300">
            Platform fees are deducted automatically before funds are delivered.
            Please review the final receivable amount before confirming your
            transaction.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2 text-amber-300">
                <FiArrowUpRight size={16} />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Withdrawal
                </span>
              </div>
              <p className="text-sm text-gray-300">
                A <span className="font-semibold text-white">20% fee</span> is
                applied on withdrawals.
              </p>
              <p className="mt-1 text-sm text-green-400">
                Example: Withdraw $100 → Receive $80
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2 text-cyan-300">
                <FiSend size={16} />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Transfer
                </span>
              </div>
              <p className="text-sm text-gray-300">
                A <span className="font-semibold text-white">10% fee</span> is
                applied on transfers.
              </p>
              <p className="mt-1 text-sm text-green-400">
                Example: Transfer $100 → Receiver gets $90
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs leading-5 text-amber-200">
            Make sure you enter the correct amount, as the displayed fee will be
            deducted from the transaction total.
          </div>
        </div>
      </div>
    </div>
    {/* /////////////////////////////////////////////////////// */}

      <div className="space-y-4">
        <MyIncomeCard
          myIncome={balance.myIncome}
          loadingBalance={loadingBalance}
          onWithdraw={onWithdrawMyIncome}
          onSend={onSendMyIncome}
          setSource={setSource}
        />

        <TeamIncomeCard
          teamIncome={balance.teamIncome}
          loadingBalance={loadingBalance}
          onWithdraw={onWithdrawTeam}
          onSend={onSendTeamIncome}
          setSource={setSource}
          />

        <ShareIncomeCard
          shareIncome={balance.shareIncome}
          loadingBalance={loadingBalance}
          onSend={onSendShareIncome}
          setSource={setSource}
        />

      </div>
    </>
  );
};

export default CheckOut;