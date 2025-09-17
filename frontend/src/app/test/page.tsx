'use client';

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind CSS Test Page</h1>
      <p className="text-gray-700 mb-4">This page tests if Tailwind CSS is working properly.</p>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-500 p-4 text-white rounded-lg">Red Box</div>
        <div className="bg-green-500 p-4 text-white rounded-lg">Green Box</div>
        <div className="bg-blue-500 p-4 text-white rounded-lg">Blue Box</div>
      </div>
      <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
        Test Button
      </button>
    </div>
  );
}