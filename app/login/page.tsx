// app/login/page.tsx
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}