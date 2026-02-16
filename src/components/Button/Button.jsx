import './Button.scss'

export default function Button({ text, href, classes = '', onClick }) {
  const Tag = href ? 'a' : 'button'

  return (
    <Tag href={href || undefined} className={`button ${classes}`} onClick={onClick}>
      <span className="button__front">{text}</span>
    </Tag>
  )
}
