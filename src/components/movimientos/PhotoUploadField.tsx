import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";

interface PhotoUploadFieldProps {
  archivo: File | null;
  onChange: (archivo: File | null) => void;
}

export function PhotoUploadField({ archivo, onChange }: PhotoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleSeleccion(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function quitarFoto() {
    onChange(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/70">
        Foto de la boleta (opcional)
      </label>

      {previewUrl ? (
        <div className="relative w-fit">
          <img
            src={previewUrl}
            alt="Vista previa de la boleta"
            className="h-28 w-28 rounded-2xl object-cover"
          />
          <button
            type="button"
            onClick={quitarFoto}
            aria-label="Quitar foto"
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1C1C1E] text-white shadow"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-black/20 text-[#8E8E93] dark:border-white/20"
        >
          <Camera size={20} />
          <span className="text-[10px] font-medium">Agregar</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleSeleccion}
        className="hidden"
      />
      {archivo && (
        <p className="mt-1 text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">{archivo.name}</p>
      )}
    </div>
  );
}
