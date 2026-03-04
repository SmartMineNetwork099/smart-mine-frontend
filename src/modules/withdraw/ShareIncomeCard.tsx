// ✅ File 1: app/(your-path)/checkout/components/MyIncomeCard.tsx
"use client";
import React, { useEffect } from "react";
import Card from "@/components/Card";
import { Input } from "rizzui/input";
import { Button } from "rizzui/button";
import { BiMoneyWithdraw } from "react-icons/bi";
import { IoIosSend } from "react-icons/io";
import { useForm, Controller } from "react-hook-form";



const sanitizeDecimal4 = (value: string) => {
  let v = value;
  if (v === "") return "";

  v = v.replace(/[^\d.]/g, "");

  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }

  const [intPart, decPart] = v.split(".");
  if (decPart !== undefined) v = `${intPart}.${decPart.slice(0, 4)}`;
  return v;
};

type FormValues = {
  userId: string;
  amount: string;
};

type Props = {
  shareIncome: number;
  loadingBalance: boolean;
  onSend: (payload: { amount: number; userId: string }) => void;
};

const ShareIncomeCard = ({ shareIncome, loadingBalance, onSend }: Props) => {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      userId: "",
      amount: "",
    },
  });



  const onValid = (data: FormValues) => {
    const a = parseFloat(data.amount);

   
   
      onSend({ amount: a, userId: data.userId.trim() });
  

    reset({ userId: "", amount: "" });
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-center">
        <div className="w-[100%] sm:w-[60%]">
          <p className="text-white text-base sm:text-xl">
            Share Income :{" "}
            <span className={`text-xl font-black ${shareIncome <= 0 ? "text-red-500" : "text-green-500"}`}>
              $ {loadingBalance ? "Loading..." : shareIncome.toLocaleString()}
            </span>
          </p>

          <div className="mt-4">
            {/* ✅ UserId (only when send) */}
            {(
              <>
                <Controller
                  control={control}
                  name="userId"
                rules={{
  validate: (v) => {

    const value = v?.trim();

    if (!value) {
      return "User ID is required for sending income.";
    }

    if (!/^[a-f\d]{24}$/i.test(value)) {
      return "Invalid User ID format.";
    }

    return true;
  },
}}
                  render={({ field }) => (
                    <Input
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={() => trigger("userId")}
                      placeholder="Enter User ID"
                      className="bg-neutral-900 text-white ring-0 border-0 outline-none rounded-md mb-2"
                      inputClassName="h-12 py-2 px-4 text-lg ring-0 border-0 outline-none"
                    />
                  )}
                />

                {errors.userId?.message && (
                  <p className="text-red-400 text-xs mb-3">{errors.userId.message}</p>
                )}
              </>
            )}

            {/* ✅ Amount */}
            <Controller
              control={control}
              name="amount"
              rules={{
                required: "Amount is required.",
                validate: (v) => {
                  const cleaned = sanitizeDecimal4(v || "");
                  const a = parseFloat(cleaned);

                  if (!cleaned) return "Amount is required.";
                  if (Number.isNaN(a) || a <= 0) return "Please enter a valid amount.";
                  if (a > shareIncome) return "Insufficient balance.";
                  return true;
                },
              }}
              render={({ field }) => (
                <Input
                  type="text"
                  inputMode="decimal"
                  value={field.value}
                  onChange={(e) => field.onChange(sanitizeDecimal4(e.target.value))}
                  onBlur={() => trigger("amount")}
                  placeholder="0.0000"
                  className="bg-neutral-900 text-green-500 ring-0 border-0 outline-none rounded-md"
                  inputClassName="h-12 py-2 px-4 text-lg ring-0 border-0 outline-none"
                />
              )}
            />

            {errors.amount?.message && (
              <p className="text-red-400 text-xs mt-2">{errors.amount.message}</p>
            )}

            <Button
              disabled={loadingBalance || isSubmitting}
              className={`mt-4 w-full flex items-center justify-center gap-2 text-lg font-bold border-0 transition-all duration-200 ${
                loadingBalance || isSubmitting
                  ? "bg-green-300 text-green-900 cursor-not-allowed opacity-70"
                  : "bg-green-500 text-black hover:bg-green-600"
              }`}
              onClick={handleSubmit(onValid)}
            >
                  Send <span className="text-xl"><IoIosSend /></span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ShareIncomeCard;