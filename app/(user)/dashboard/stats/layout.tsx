import MenuBar from "../_components/MenuBar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MenuBar />
      {children}
    </>
  );
}
