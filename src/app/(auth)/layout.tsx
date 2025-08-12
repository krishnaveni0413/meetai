//this is to give style to the childern components in this case the sign-in and sign -up 


interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-4">
      <div className="w-full max-w-sm sm:max-w-md  lg:max-w-3xl ">
        {children}
      </div>
    </div>
  );
};

export default Layout;
