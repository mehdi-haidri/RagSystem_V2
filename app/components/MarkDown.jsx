import React from 'react'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

function MarkDown({text}) {

    const md = MarkdownIt("commonmark")
    const html = md.render(text);
  return (
    <div className='text-lg text-semibold text-gray-200 font-sans' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(html)}}></div>
  )
}

export default MarkDown