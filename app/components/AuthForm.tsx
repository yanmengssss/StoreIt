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

// 定义表单类型：登录或注册
type FormType = "sign-in" | "sign-up";

// 认证表单组件，接收 type 参数确定是登录还是注册表单
const AuthForm = ({ type }: { type: FormType }) => {
  // 定义表单验证模式
  const formSchema = z.object({
    username: z.string().min(2, {
      message: "用户名至少需要2个字符",
    }),
  });

  // 使用 react-hook-form 创建表单实例
  // 泛型参数使用 z.infer 从 schema 中推断类型
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // 使用 zod 验证器
    defaultValues: {
      username: "", // 设置默认值
    },
    // 添加实时验证配置
    mode: "onChange", // 输入变化时就验证
  });

  // 表单提交处理函数
  // values 包含验证通过的表单数据
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  // 渲染表单
  return (
    <>
      {/* handleSubmit 会在提交前进行表单验证 */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 auth-form"
        >
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "sign-in" && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入用户名"
                      {...field}
                      // 添加 onBlur 事件处理
                      onBlur={() => {
                        form.trigger("username"); // 手动触发验证
                      }}
                    />
                  </FormControl>
                  <FormDescription>这是您的公开显示名称</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit">{type === "sign-in" ? "登录" : "注册"}</Button>
        </form>
      </Form>
    </>
  );
};

export default AuthForm;
