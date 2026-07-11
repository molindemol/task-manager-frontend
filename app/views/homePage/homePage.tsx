import BoardsOverviewContainer from "@/components/boardsOverviewContainer/boardsOverviewContainer";

export function HomePage() {
  return (
    <main className="flex min-h-screen w-full justify-center bg-gradient-to-br from-white via-sky-50 to-indigo-50 px-4 py-12 sm:py-16">
      <BoardsOverviewContainer />
    </main>
  );
}
