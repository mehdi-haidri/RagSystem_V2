import React from 'react'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

function MarkDown({text, className}) {

  const md = MarkdownIt({
      breaks: true
    })
    const html = md.render(text);
  return (
    <div className={'text-lg text-semibold  font-sans ' + className } dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(html)}}></div>
  )
}

export default MarkDown