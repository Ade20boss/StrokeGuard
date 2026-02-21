export function Greeting() {
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="px-5 pt-5 pb-3">
      <h1 
        className="text-[21px] font-semibold text-[#0F172A]"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Good {getTimeOfDay()}, John
      </h1>
      <p 
        className="text-[13px] text-[#94A3B8] mt-0.5"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        {getFormattedDate()}
      </p>
    </div>
  );
}
