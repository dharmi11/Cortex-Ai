import React from 'react';
import { Children } from 'react';
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useState } from 'react';
import Markdown from 'react-markdown';
import markdown from "react-markdown"

import remarkGfm from 'remark-gfm'


const MessageBubble = ({ role, content, images }) => {
  const isUser = role === "user";
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit md:max-w-[72%] px-4 py-1 text-xl rounded-2xl break-words overflow-hidden leading-relaxed
          ${isUser
            ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
            : " text-slate-200 rounded-tl-sm"
          }`}
      >

        {images.length > 0 && (
          <div className='flex flex-wrap gap-3 mt-4'>
            <PhotoProvider>
              {images.map((img, i) => (
                <PhotoView
                  key={i}
                  src={img.url}
                >
                  <img
                    src={img.url}
                    className="w-50 h-40 object-cover rounded-xl cursor-pointer"
                  />
                </PhotoView>
              ))}
            </PhotoProvider>

          </div>
        )}


        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4 text-white border-b border-white/10 pb-2">
                {children}
              </h1>
            ),

            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold mt-7 mb-3 text-white">
                {children}
              </h2>
            ),

            h3: ({ children }) => (
              <h3 className="text-xl font-semibold mt-6 mb-3 text-indigo-300">
                {children}
              </h3>
            ),

            h4: ({ children }) => (
              <h4 className="text-lg font-medium mt-5 mb-2 text-cyan-300">
                {children}
              </h4>
            ),

            p: ({ children }) => (
              <p className="leading-8 text-slate-300 mb-4 whitespace-pre-wrap">
                {children}
              </p>
            ),

            strong: ({ children }) => (
              <strong className="font-bold text-white">
                {children}
              </strong>
            ),

            em: ({ children }) => (
              <em className="italic text-indigo-300">
                {children}
              </em>
            ),

            ul: ({ children }) => (
              <ul className="list-disc pl-6 my-4 space-y-2 text-slate-300">
                {children}
              </ul>
            ),

            ol: ({ children }) => (
              <ol className="list-decimal pl-6 my-4 space-y-2 text-slate-300">
                {children}
              </ol>
            ),

            li: ({ children }) => (
              <li className="leading-7 marker:text-indigo-400">
                {children}
              </li>
            ),

            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-indigo-500 bg-indigo-500/10 px-4 py-3 rounded-r-xl italic my-5 text-slate-200">
                {children}
              </blockquote>
            ),

            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 underline underline-offset-4 break-all"
              >
                {children}
              </a>
            ),

            hr: () => (
              <hr className="my-6 border-white/10" />
            ),

            table: ({ children }) => (
              <div className="overflow-x-auto my-5 rounded-xl border border-white/10">
                <table className="w-full border-collapse">
                  {children}
                </table>
              </div>
            ),

            thead: ({ children }) => (
              <thead className="bg-white/10">
                {children}
              </thead>
            ),

            tbody: ({ children }) => (
              <tbody>
                {children}
              </tbody>
            ),

            tr: ({ children }) => (
              <tr className="border-b border-white/10">
                {children}
              </tr>
            ),

            th: ({ children }) => (
              <th className="px-4 py-3 text-left font-semibold text-white">
                {children}
              </th>
            ),

            td: ({ children }) => (
              <td className="px-4 py-3 text-slate-300 align-top">
                {children}
              </td>
            ),

            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="rounded-xl my-4 max-w-full border border-white/10"
              />
            ),

            code({ inline, children }) {
              if (inline) {
                return (
                  <code className="bg-white/10 px-1.5 py-0.5 rounded text-pink-400 font-mono text-sm">
                    {children}
                  </code>
                );
              }

              return (
                <pre className="bg-[#111827] border border-white/10 rounded-xl p-4 overflow-x-auto my-5">
                  <code className="text-green-300 font-mono text-sm">
                    {children}
                  </code>
                </pre>
              );
            },
          }}
        >
          {content}
        </Markdown>
      </div>

    </div>

  );
};

export default MessageBubble;