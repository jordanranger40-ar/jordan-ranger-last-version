import React from "react";
interface Props {
  text: string;
}

const FancyTitles = ({text}:Props) => {
  return (
    <div className=" text-white font-sans flex flex-col items-center justify-center py-10">
      <h2
        className="fancy text-[1.8rem] mt-8"
        style={
          {
            "--w": "50vw",
            "--c": "#484d23",
            "--b": "4px",
            "--g": "40px",
          } as React.CSSProperties
        }
      >
{text}    </h2>

      <style>{`
        .fancy {
          --b: 6px;
          --w: 80px;
          --g: 15px;
          --c: #0B486B;
          width: fit-content;
          padding: 0 1em;
          line-height: 1.6em;
          color: #fff;
          background:
            conic-gradient(from 45deg at left, var(--c) 25%, #0000 0) 0,
            conic-gradient(from -135deg at right, var(--c) 25%, #0000 0) 100%;
          background-size: 51% 100%;
          background-repeat: no-repeat;

          /* لازم لإظهار الفاصل الأوسط */
          border-style: solid;
          border-width: 0 0 var(--b) 0;

          border-image:
            linear-gradient(
              #0000 calc(50% - var(--b)/2),
              var(--c) 0 calc(50% + var(--b)/2),
              #0000 0
            )
            1/0 var(--w)/calc(var(--w) + var(--g));
          margin-inline: auto;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default FancyTitles;
