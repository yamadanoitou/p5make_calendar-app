export default function Marquee() {
  const text = ' \u2605 SCHEDULE \u2605 EXECUTE \u2605 CONQUER \u2605 REPEAT'
  return (
    <div className="marquee">
      <div className="marquee-inner">
        {text}{text}{text}{text}
      </div>
    </div>
  )
}
