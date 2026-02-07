import Image from "next/image";

type PhotoFrameProps = {
  variant: 1 | 2 | 3;
  imageSrc?: string;
  alt?: string;
  className?: string;
};

export default function PhotoFrame({
  variant,
  imageSrc,
  alt = "",
  className = "",
}: PhotoFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Photo */}
      <div className="relative w-full h-full overflow-hidden">
        {imageSrc ? (
          <Image src={imageSrc} alt={alt} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[#d9d9d9]" />
        )}
      </div>

      {/* Lemon diagonal accents */}
      {(variant === 1 || variant === 2) && (
        <>
          {/* Bottom-left accent */}
          <div
            className="absolute bottom-[-8px] left-[-8px] w-[60px] h-[60px] bg-[#F2FD84] -z-10"
            style={{ transform: "rotate(45deg)" }}
          />
          {/* Top-right accent */}
          <div
            className="absolute top-[-8px] right-[-8px] w-[60px] h-[60px] bg-[#F2FD84] -z-10"
            style={{ transform: "rotate(45deg)" }}
          />
        </>
      )}
      {variant === 3 && (
        /* Bottom-right accent */
        <div
          className="absolute bottom-[-8px] right-[-8px] w-[60px] h-[60px] bg-[#F2FD84] -z-10"
          style={{ transform: "rotate(45deg)" }}
        />
      )}
    </div>
  );
}
