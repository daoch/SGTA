// app-loading.tsx
'use client';


const AppLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="animate-spin h-16 w-16 rounded-full border-t-4 border-blue-500 border-solid" />
        <p className="mt-4 text-gray-700 text-lg">Cargando...</p>
      </div>
    </div>
  );
};

export default AppLoading;