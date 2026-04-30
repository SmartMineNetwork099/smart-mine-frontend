// ✅ File 4: app/(your-path)/checkout/index.tsx  (main page/component)
"use client";
import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { FiAlertTriangle, FiArrowUpRight, FiSend } from "react-icons/fi";
import MyIncomeCard from "./MyIncomeCard";
import TeamIncomeCard from "./TeamIncomeCard";
import ShareIncomeCard from "./ShareIncomeCard";
import { formatAmount } from "@/utils/func";
import { shareIncomeApi, withdrawIncomeApi } from "@/apis/withdrawApis";
import { toast } from "react-toastify";
import { roundTo4 } from "@/utils/amount";
import { upsertUserData } from "@/db/saveData";
import { useUserData } from "@/hooks/useUserData";
import Messages from "@/constants/messages";
import { MINIMUM_WITHDRAW_INCOME , MAXIMUM_WITHDRAW_INCOME, MINIMUM_SHARE_INCOME, MAXIMUM_SHARE_INCOME} from "@/config/constants";
import { formatCooldownRemaining, getCooldownRemainingMs } from "@/utils/cooldown";
import { getUserDataApi } from "@/apis/user";

const CheckOut = () => {
  const router = useRouter();

  const [balance, setBalance] = useState<any>({
    myIncome: 0,
    teamIncome: 0,
    shareIncome: 0,
  });
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const { userData, isFreeze,walletAddress, refreshUser } = useUserData();



  const handleWalletDataFetch = async () => {
    if (!walletAddress) return;

    try {
      setLoadingBalance(true);

      const localUser: any = userData;
      const my = formatAmount(localUser?.wallet?.myIncome ?? 0);
      const team = formatAmount(localUser?.wallet?.teamIncome ?? 0);
      const share = formatAmount(localUser?.wallet?.shareIncome ?? 0);

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

       setLoadingBalance(false);

      const res = await getUserDataApi();
      const user = res?.data?.user || {};
      const myIncome = formatAmount(user?.wallet?.myIncome ?? 0);
      const teamIncome= formatAmount(user?.wallet?.teamIncome ?? 0);
      const shareIncome = formatAmount(user?.wallet?.shareIncome ?? 0);

       setBalance({
        myIncome: myIncome,
        teamIncome: teamIncome,
        shareIncome: shareIncome,
      });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setBalance({ myIncome: 0, teamIncome: 0 , shareIncome: 0 });
    }
  };

  useEffect(() => {
    if (!walletAddress) return;
    handleWalletDataFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const handleBack = () => router.push(ROUTES?.STACKING?.DASHBOARD);

  // ✅ callbacks for MyIncomeCard
  const onWithdrawMyIncome =async (amount: number, source: string) => {
  
    if(loadingBalance) return;
    if (!walletAddress) return;
    if (isFreeze) {
     toast.error(Messages?.FREEZE_ACCOUNT);
    return;
    }

    if(roundTo4(amount)>roundTo4(balance?.myIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(MINIMUM_WITHDRAW_INCOME)){
      toast.error(`minimum withdraw ${MINIMUM_WITHDRAW_INCOME}`)
      return;
    }
    if(roundTo4(amount)>roundTo4(MAXIMUM_WITHDRAW_INCOME)){
      toast.error(`maximum withdraw ${MAXIMUM_WITHDRAW_INCOME}`)
      return;
    }



     const withdrawCooldownRemaining = getCooldownRemainingMs(userData?.wallet?.lastWithdrawAt);
    if (withdrawCooldownRemaining > 0) {
      toast.error(`Please try again after ${formatCooldownRemaining(withdrawCooldownRemaining)}.`)
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
          await refreshUser();
           window.dispatchEvent(
        new CustomEvent("wallet-updated", {
         detail: { walletAddress },
        })
        );
          handleWalletDataFetch()
  };

  const onSendMyIncome = async({
    amount,
    userId,
    source,
  }: {
    amount: number;
    userId: string;
    source: string;
  }) => {
       if(loadingBalance) return
       if (!walletAddress) return;
      if (isFreeze) {
     toast.error(Messages?.FREEZE_ACCOUNT);
    return;
    }

    if(roundTo4(amount)>roundTo4(balance?.myIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(MINIMUM_SHARE_INCOME)){
      toast.error(`minimum withdraw ${MINIMUM_SHARE_INCOME}`)
      return;
    }
    if(roundTo4(amount)>roundTo4(MAXIMUM_SHARE_INCOME)){
      toast.error(`maximum withdraw ${MAXIMUM_SHARE_INCOME}`)
      return;
    }

    
     const shareCooldownRemaining = getCooldownRemainingMs(userData?.wallet?.lastShareAt);
    if (shareCooldownRemaining > 0) {
      toast.error(`Please try again after ${formatCooldownRemaining(shareCooldownRemaining)}.`)
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
          await refreshUser();
           window.dispatchEvent(
        new CustomEvent("wallet-updated", {
         detail: { walletAddress },
        })
        );
          handleWalletDataFetch()
  };

  // ✅ callbacks for TeamIncomeCard
  const onWithdrawTeamIncome = async(amount: number, source: string) => {
  
  if(loadingBalance) return
  if (!walletAddress) return;
      if (isFreeze) {
     toast.error(Messages?.FREEZE_ACCOUNT);
    return;
    }

    if(roundTo4(amount)>roundTo4(balance?.teamIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(MINIMUM_WITHDRAW_INCOME)){
      toast.error(`minimum withdraw ${MINIMUM_WITHDRAW_INCOME}`)
      return;
    }
     if(roundTo4(amount)>roundTo4(MAXIMUM_WITHDRAW_INCOME)){
      toast.error(`maximum withdraw ${MAXIMUM_WITHDRAW_INCOME}`)
      return;
    }

    const withdrawCooldownRemaining = getCooldownRemainingMs(userData?.wallet?.lastWithdrawAt);
    if (withdrawCooldownRemaining > 0) {
      toast.error(`Please try again after ${formatCooldownRemaining(withdrawCooldownRemaining)}.`)
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
          await refreshUser();
           window.dispatchEvent(
        new CustomEvent("wallet-updated", {
         detail: { walletAddress },
        })
        );
          handleWalletDataFetch()
  };


  const onSendTeamIncome = async ({
    amount,
    userId,
    source,
  }: {
    amount: number;
    userId: string;
    source: string;
  }) => {
       if(loadingBalance) return
       if (!walletAddress) return;
           if (isFreeze) {
     toast.error(Messages?.FREEZE_ACCOUNT);
    return;
    }

    if(roundTo4(amount)>roundTo4(balance?.teamIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(MINIMUM_SHARE_INCOME)){
      toast.error(`minimum withdraw ${MINIMUM_SHARE_INCOME}`)
      return;
    }
     if(roundTo4(amount)>roundTo4(MAXIMUM_SHARE_INCOME)){
      toast.error(`maximum withdraw ${MAXIMUM_SHARE_INCOME}`)
      return;
    }

    
     const shareCooldownRemaining = getCooldownRemainingMs(userData?.wallet?.lastShareAt);
    if (shareCooldownRemaining > 0) {
      toast.error(`Please try again after ${formatCooldownRemaining(shareCooldownRemaining)}.`)
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
          await refreshUser();
           window.dispatchEvent(
        new CustomEvent("wallet-updated", {
         detail: { walletAddress },
        })
        );
          handleWalletDataFetch()

  };

  const onSendShareIncome = async ({
    amount,
    userId,
    source,
  }: {
    amount: number;
    userId: string;
    source: string;
  }) => {
     if(loadingBalance) return
     if (!walletAddress) return;
         if (isFreeze) {
     toast.error(Messages?.FREEZE_ACCOUNT);
    return;
    }

    if(roundTo4(amount)>roundTo4(balance?.shareIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(MINIMUM_SHARE_INCOME)){
      toast.error(`minimum withdraw ${MINIMUM_SHARE_INCOME}`)
      return;
    }
     if(roundTo4(amount)>roundTo4(MAXIMUM_SHARE_INCOME)){
      toast.error(`maximum withdraw ${MAXIMUM_SHARE_INCOME}`)
      return;
    }

    
     const shareCooldownRemaining = getCooldownRemainingMs(userData?.wallet?.lastShareAt);
    if (shareCooldownRemaining > 0) {
      toast.error(`Please try again after ${formatCooldownRemaining(shareCooldownRemaining)}.`)
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
          await refreshUser();
           window.dispatchEvent(
        new CustomEvent("wallet-updated", {
         detail: { walletAddress },
        })
        );
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
                 Max Withdrawal ${MAXIMUM_WITHDRAW_INCOME}
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
                  Max Transfer ${MAXIMUM_SHARE_INCOME}
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
        />

        <TeamIncomeCard
          teamIncome={balance.teamIncome}
          loadingBalance={loadingBalance}
          onWithdraw={onWithdrawTeamIncome}
          onSend={onSendTeamIncome}
          />

        <ShareIncomeCard
          shareIncome={balance.shareIncome}
          loadingBalance={loadingBalance}
          onSend={onSendShareIncome}
        />

      </div>
    </>
  );
};

export default CheckOut;
