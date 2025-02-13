"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { sendEmailOTP, verifyOTP } from "@/lib/actions/user.actions";
import { redirect, useRouter } from "next/navigation";
import { getOtp, login, register } from "@/lib/apis/user";
const OTPModal = ({
  changeAccountId,
  accountId,
  email,
  type,
}: {
  changeAccountId: any;
  accountId: string;
  email: string;
  type: string;
}) => {
  const [otp, setOtp] = useState(true);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  //appwrite
  // const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const sessionId = await verifyOTP({ accountId, password });
  //     if (sessionId) {
  //       // userStore().setToken(sessionId);
  //       router.push("/");
  //     }
  //   } catch (error) {
  //     //console.log("Failed to verify OTP", error);
  //   }
  //   setLoading(false);
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    let res: any = null;
    if (type === "sign-in") {
      res = await login({
        email,
        otp: password,
      });
    } else if (type === "sign-up") {
      res = await register({
        email,
        otp: password,
        name: accountId,
      });
    }
    if (res.code === 200) {
      setTimeout(() => {
        // 如果有必要检查 session，可以取消注释并添加逻辑
        setLoading(false);
        redirect("/");
        // }
      }, 2000);
    } else {
      toast({
        duration: 2000,
        description: <span className="text-error">{res.message}</span>,
      });
      setLoading(false);
    }
  };
  //重新发送 appwrite
  // const handleResendOto = async () => {
  //   try {
  //     await sendEmailOTP({ email });
  //   } catch (error) {
  //     //console.log("Failed to resend OTP", error);
  //   }
  // };
  useEffect(() => {
    if (!otp) {
      changeAccountId(null);
    }
  }, [otp]);
  const handleResendOto = async () => {
    const res = await getOtp({
      email: email || "",
      type: type === "sign-in" ? "login" : "register",
    });
    if (res.code == 200)
      toast({
        duration: 1000,
        description: "重新发送成功",
      });
    else
      toast({
        duration: 2000,
        description: <span className="text-error">验证码发送失败</span>,
      });
  };
  return (
    <>
      <AlertDialog open={otp} onOpenChange={setOtp}>
        <AlertDialogContent className="shad-alert-dialog">
          <AlertDialogHeader className="relative flex justify-center ">
            <AlertDialogTitle className="h2 text-center">
              请输入验证码
              <Image
                src="/assets/icons/close-dark.svg"
                alt="close"
                width={20}
                height={20}
                className="otp-close-button"
                onClick={() => setOtp(false)}
              />
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center subtitle-2 text-light-100">
              我们已经发送验证码到邮箱{" "}
              <span className="pl-1 text-brand">{email}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <InputOTP maxLength={6} value={password} onChange={setPassword}>
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot index={0} className="shad-otp-slot" />
              <InputOTPSlot index={1} className="shad-otp-slot" />
              <InputOTPSlot index={2} className="shad-otp-slot" />
              <InputOTPSlot index={3} className="shad-otp-slot" />
              <InputOTPSlot index={4} className="shad-otp-slot" />
              <InputOTPSlot index={5} className="shad-otp-slot" />
            </InputOTPGroup>
          </InputOTP>

          <AlertDialogFooter>
            <div className="flex w-full flex-col grp-4">
              <AlertDialogAction
                type="button"
                className="shad-submit-btn h-12"
                onClick={handleSubmit}
              >
                提交
                {loading && (
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="ml-2 animate-spin"
                  />
                )}
              </AlertDialogAction>
              <div className="text-center subtitle-2 text-light-100 mt-2">
                没有收到验证码？
                <button className="pl-1 text-brand" onClick={handleResendOto}>
                  重新发送
                </button>
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OTPModal;
