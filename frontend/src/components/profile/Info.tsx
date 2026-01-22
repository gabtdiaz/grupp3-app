export default function Info() {

  return (
    <div className="relative pt-16 px-6">
      <h1 className="text-2xl font-serif">Trollet Bengt</h1>
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
        <span>Malmöe</span>
        <span>•</span>

        <span>113 år</span>
        <span>•</span>
        <span>Sliskgubbe</span>
      </div>
      <div>
        <p className="mt-2 text-gray-400 italic text-sm">
          Vivamus nulla risus, aliquet sed lacus in, tempus convallis erat.
          Curabitur non felis ut magna placerat viverra.
        </p>
      </div>
      <button className="absolute top-4 right-4 w-7 h-7 rounded-full ">
        <img src="/settings-icon.svg" alt="Settings" className="w-7 h-7" />
      </button>
    </div>
  );
}
