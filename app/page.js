export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
        Test Case Data Management
      </h1>
      <p className="text-zinc-700 dark:text-zinc-300 max-w-lg text-center mb-6">
        Welcome! This project lets you upload and manage XPS and eMember test
        cases using Excel files and view them via a web UI. Use the menu to get
        started.
      </p>
      <div className="space-x-4">
        <a
          href="/data-uploads"
          className="inline-block rounded bg-blue-600 px-6 py-2 text-white font-medium shadow hover:bg-blue-700 transition"
        >
          Upload Data
        </a>
        <a
          href="/xps"
          className="inline-block rounded border border-blue-600 px-6 py-2 text-blue-600 font-medium shadow hover:bg-blue-50 dark:hover:bg-zinc-900 transition"
        >
          View XPS Test Cases
        </a>
        <a
          href="/emember"
          className="inline-block rounded border border-blue-600 px-6 py-2 text-blue-600 font-medium shadow hover:bg-blue-50 dark:hover:bg-zinc-900 transition"
        >
          View eMember Test Cases
        </a>
      </div>
    </main>
  );
}
