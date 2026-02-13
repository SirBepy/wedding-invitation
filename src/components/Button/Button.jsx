import './Button.scss'

export default function Button({ text, href, classes = '' }) {
  const Tag = href ? 'a' : 'button'

  return (
    <Tag href={href || undefined} className={`button ${classes}`}>
      <span className="button__front">{text}</span>
    </Tag>
  )
}
