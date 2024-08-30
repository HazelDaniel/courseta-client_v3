export const convertSecondsToHms: (seconds: number) => {
  hours: number;
  minutes: number;
  seconds: number;
} = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;

  const minutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsAfterMinutes = remainingSeconds % 60;

  return {
    hours,
    minutes,
    seconds: remainingSecondsAfterMinutes,
  };
};

export const extractDMYFromDateString: (dateString: string) => string = (
  dateString
) => {
  const dateComputed = new Date(dateString);
  const template = `${dateComputed
    .getDate()
    .toString()
    .padStart(2, "0")}/${dateComputed
    .getMonth()
    .toString()
    .padStart(2, "0")}/${dateComputed.getFullYear()}`;
  return template;
};

/* * extract a link if the link is convertible to an embedded youtube link
    [false, string] if already an embedded youtube link
    [false, null] if its not already an embedded youtube link and not convertible
    [true, string] if its not already an embedded youtube link and is convertible
*/
export const extractIfConvertibleEmbed_: (
  input: string
) => [boolean, string | null] = (input) => {
  let match1 = input.match(
    /^http.*(?:m\.youtube)(?:(?:\.com\/watch\?v=)|(?:\/))(.*)$/
  );
  let match2 = input.match(/^http.*(?:youtu\.be)\/(.*)$/);
  let match3 = input.match(
    /^http.*(?:www.youtube)(?:(?:\.com\/watch\?v=)|(?:\/))(.*)$/
  );

  let embedMatch = input.match(
    /^http.*(?:(?:www|m)\.youtube(?:-nocookie)?\.com\/o?embed\/).*$/
  );
  if (embedMatch) return [false, embedMatch[0]];

  if (match1?.length) {
    return [true, `https://www.youtube.com/embed/${match1[1]}`];
  }

  if (match2?.length) {
    return [true, `https://www.youtube.com/embed/${match2[1]}`];
  }

  if (match3?.length) {
    return [true, `https://www.youtube.com/embed/${match3[1]}`];
  }

  return [false, null];
};

