"use client";

// 导入必要的依赖
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import OTPModal from "./OTPModal";

// 定义表单类型：登录或注册
type FormType = "sign-in" | "sign-up";

// 认证表单组件，接收 type 参数确定是登录还是注册表单
const AuthForm = ({ type }: { type: FormType }) => {
  // 修改表单验证模式，根据表单类型动态设置验证规则
  const authFormSchema = (formType: FormType) => {
    return z.object({
      email: z.string().email(),
      username:
        formType === "sign-up"
          ? z.string().min(2).max(50)
          : z.string().optional(),
    });
  };
  // 使用 react-hook-form 创建表单实例
  // 泛型参数使用 z.infer 从 schema 中推断类型
  // 修改表单默认值
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  // 表单提交处理函数
  // values 包含验证通过的表单数据
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const user =
        type === "sign-up"
          ? await createAccount({
              email: values.email || "",
              fullName: values.username || "",
            })
          : await signInUser({ email: values.email || "" });
      setAccountId(user.accountId);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("发生未知错误");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 渲染表单
  return (
    <>
      {/* handleSubmit 会在提交前进行表单验证 */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">用户名</FormLabel>
                    <FormControl>
                      <Input
                        className="shad-input"
                        placeholder="请输入用户名"
                        {...field}
                        // 添加 onBlur 事件处理
                        onBlur={() => {
                          form.trigger("username"); // 手动触发验证
                        }}
                      />
                    </FormControl>
                  </div>
                  {/* <FormDescription>这是您的公开显示名称</FormDescription> */}
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="shad-input"
                      placeholder="请输入邮箱"
                      {...field}
                      // 添加 onBlur 事件处理
                      onBlur={() => {
                        form.trigger("username"); // 手动触发验证
                      }}
                    />
                  </FormControl>
                </div>
                {/* <FormDescription>这是您的公开显示名称</FormDescription> */}
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type === "sign-in" ? "登录" : "注册"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              ></Image>
            )}
          </Button>
          {errorMessage && <p className="error-message">*{errorMessage}</p>}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in" ? "没有账号？" : "已有账号？"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand"
            >
              {type === "sign-in" ? "注册" : "登录"}
            </Link>
          </div>
        </form>
      </Form>
      {accountId && (
        <OTPModal accountId={accountId!} email={form.getValues("email")} />
      )}
    </>
  );
};

export default AuthForm;
