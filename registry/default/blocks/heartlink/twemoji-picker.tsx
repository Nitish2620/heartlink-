import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search, X, Clock, Smile, Leaf, Coffee, Plane, Lightbulb, Hash, Flag, Heart, Star } from 'lucide-react';

// ─── Twemoji SVG renderer ───────────────────────────────────────────────
const TwemojiImg = React.memo(({ emoji, size = 24 }: { emoji: string; size?: number }) => {
  const codePoint = [...emoji]
    .map(c => c.codePointAt(0)!.toString(16))
    .filter(c => c !== 'fe0f')
    .join('-');
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${codePoint}.svg`}
      alt={emoji}
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      className="inline-block"
      style={{ width: size, height: size }}
    />
  );
});
TwemojiImg.displayName = 'TwemojiImg';

// ─── Emoji Data (Comprehensive set organized by category) ───────────────
const EMOJI_CATEGORIES: { id: string; name: string; icon: React.ReactNode; emojis: string[] }[] = [
  {
    id: 'frequent',
    name: 'Frequently Used',
    icon: <Clock className="w-4 h-4" />,
    emojis: [] // populated dynamically
  },
  {
    id: 'smileys',
    name: 'Smileys & People',
    icon: <Smile className="w-4 h-4" />,
    emojis: [
      '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃',
      '😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙',
      '🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🫢',
      '🫣','🤫','🤔','🫡','🤐','🤨','😐','😑','😶','🫥',
      '😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴',
      '😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯',
      '🤠','🥳','🥸','😎','🤓','🧐','😕','🫤','😟','🙁',
      '☹️','😮','😯','😲','😳','🥺','🥹','😦','😧','😨',
      '😰','😥','😢','😭','😱','😖','😣','😞','😓','😩',
      '😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️',
      '💩','🤡','👹','👺','👻','👽','👾','🤖','😺','😸',
      '😹','😻','😼','😽','🙀','😿','😾','🙈','🙉','🙊',
      '👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','👌',
      '🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉',
      '👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛',
      '🤜','👏','🙌','🫶','👐','🤲','🤝','🙏','✍️','💅',
      '🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠',
      '🫀','🫁','🦷','🦴','👀','👁️','👅','👄','💋','🩸',
      '👶','👧','🧒','👦','👩','🧑','👨','👩‍🦱','🧑‍🦱','👨‍🦱',
      '👩‍🦰','🧑‍🦰','👨‍🦰','👱‍♀️','👱','👱‍♂️','👩‍🦳','🧑‍🦳','👨‍🦳','👩‍🦲',
      '🧑‍🦲','👨‍🦲','🧔‍♀️','🧔','🧔‍♂️','👵','🧓','👴','👲','👳‍♀️',
      '👳','👳‍♂️','🧕','👮‍♀️','👮','👮‍♂️','👷‍♀️','👷','👷‍♂️','💂‍♀️',
      '💂','💂‍♂️','🕵️‍♀️','🕵️','🕵️‍♂️','👩‍⚕️','🧑‍⚕️','👨‍⚕️','👩‍🌾','🧑‍🌾',
    ]
  },
  {
    id: 'hearts',
    name: 'Hearts & Love',
    icon: <Heart className="w-4 h-4" />,
    emojis: [
      '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔',
      '❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝',
      '💟','♥️','💑','👩‍❤️‍👨','👩‍❤️‍👩','👨‍❤️‍👨','💏','👩‍❤️‍💋‍👨','👩‍❤️‍💋‍👩','👨‍❤️‍💋‍👨',
      '🫂','👪','👨‍👩‍👦','👨‍👩‍👧','👨‍👩‍👧‍👦','👨‍👩‍👦‍👦','👨‍👩‍👧‍👧',
    ]
  },
  {
    id: 'nature',
    name: 'Animals & Nature',
    icon: <Leaf className="w-4 h-4" />,
    emojis: [
      '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨',
      '🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊',
      '🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉',
      '🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌',
      '🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️','🕸️','🦂',
      '🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀',
      '🐡','🐠','🐟','🐬','🐳','🐋','🦈','🦭','🐊','🐅',
      '🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒',
      '🦘','🦬','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙',
      '🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🪶','🐓',
      '🦃','🦤','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨',
      '🦡','🦫','🦦','🦥','🐁','🐀','🐿️','🦔','🐾','🐉',
      '🌵','🎄','🌲','🌳','🌴','🪵','🌱','🌿','☘️','🍀',
      '🎍','🪴','🎋','🍃','🍂','🍁','🪺','🪹','🍄','🌾',
      '💐','🌷','🌹','🥀','🌺','🌸','🌼','🌻','🌞','🌝',
      '🌛','🌜','🌚','🌕','🌖','🌗','🌘','🌑','🌒','🌓',
      '🌔','🌙','🌎','🌍','🌏','🪐','💫','⭐','🌟','✨',
      '⚡','☄️','💥','🔥','🌪️','🌈','☀️','🌤️','⛅','🌥️',
      '☁️','🌦️','🌧️','⛈️','🌩️','🌨️','❄️','☃️','⛄','🌬️',
      '💨','💧','💦','🫧','☔','☂️','🌊','🌫️',
    ]
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: <Coffee className="w-4 h-4" />,
    emojis: [
      '🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐',
      '🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑',
      '🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🫒','🧄','🧅',
      '🥔','🍠','🫘','🥐','🥯','🍞','🥖','🥨','🧀','🥚',
      '🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭',
      '🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔',
      '🥗','🥘','🫕','🥫','🍝','🍜','🍲','🍛','🍣','🍱',
      '🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢',
      '🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭',
      '🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🥛','🍼',
      '🫖','☕','🍵','🧃','🥤','🧋','🍶','🍺','🍻','🥂',
      '🍷','🥃','🍸','🍹','🧉','🍾','🧊','🥄','🍴','🍽️',
      '🥣','🥡','🥢','🧂',
    ]
  },
  {
    id: 'activities',
    name: 'Activities',
    icon: <Star className="w-4 h-4" />,
    emojis: [
      '⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱',
      '🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳',
      '🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷',
      '⛸️','🥌','🎿','⛷️','🏂','🪂','🏋️‍♀️','🏋️','🤼‍♀️','🤼',
      '🤸‍♀️','🤸','⛹️‍♀️','⛹️','🤺','🤾‍♀️','🤾','🏌️‍♀️','🏌️','🏇',
      '🧘‍♀️','🧘','🏄‍♀️','🏄','🏊‍♀️','🏊','🤽‍♀️','🤽','🚣‍♀️','🚣',
      '🧗‍♀️','🧗','🚵‍♀️','🚵','🚴‍♀️','🚴','🏆','🥇','🥈','🥉',
      '🏅','🎖️','🏵️','🎗️','🎫','🎟️','🎪','🤹‍♀️','🤹','🎭',
      '🩰','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🪘','🎷',
      '🎺','🪗','🎸','🪕','🎻','🪈','🎲','♟️','🎯','🎳',
      '🎮','🕹️','🧩','🪩',
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Places',
    icon: <Plane className="w-4 h-4" />,
    emojis: [
      '🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐',
      '🛻','🚚','🚛','🚜','🦯','🦽','🦼','🛴','🚲','🛵',
      '🏍️','🛺','🚨','🚔','🚍','🚘','🚖','🛞','🚡','🚠',
      '🚟','🚃','🚋','🚞','🚝','🚄','🚅','🚈','🚂','🚆',
      '🚇','🚊','🚉','✈️','🛫','🛬','🛩️','💺','🛰️','🚀',
      '🛸','🚁','🛶','⛵','🚤','🛥️','🛳️','⛴️','🚢','⚓',
      '🪝','⛽','🚧','🚦','🚥','🚏','🗺️','🗿','🗽','🗼',
      '🏰','🏯','🏟️','🎡','🎢','🎠','⛲','⛱️','🏖️','🏝️',
      '🏜️','🌋','⛰️','🏔️','🗻','🏕️','⛺','🛖','🏠','🏡',
      '🏘️','🏚️','🏗️','🏭','🏢','🏬','🏣','🏤','🏥','🏦',
      '🏨','🏪','🏫','🏩','💒','🏛️','⛪','🕌','🕍','🛕',
      '🕋','⛩️','🛤️','🛣️','🗾','🎑','🏞️','🌅','🌄','🌠',
      '🎇','🎆','🌇','🌆','🏙️','🌃','🌌','🌉','🌁',
    ]
  },
  {
    id: 'objects',
    name: 'Objects',
    icon: <Lightbulb className="w-4 h-4" />,
    emojis: [
      '⌚','📱','📲','💻','⌨️','🖥️','🖨️','🖱️','🖲️','🕹️',
      '🗜️','💽','💾','💿','📀','📼','📷','📸','📹','🎥',
      '📽️','🎞️','📞','☎️','📟','📠','📺','📻','🎙️','🎚️',
      '🎛️','🧭','⏱️','⏲️','⏰','🕰️','⌛','⏳','📡','🔋',
      '🪫','🔌','💡','🔦','🕯️','🪔','🧯','🛢️','💸','💵',
      '💴','💶','💷','🪙','💰','💳','💎','⚖️','🪜','🧰',
      '🪛','🔧','🔨','⚒️','🛠️','⛏️','🪚','🔩','⚙️','🪤',
      '🧱','⛓️','🧲','🔫','💣','🧨','🪓','🔪','🗡️','⚔️',
      '🛡️','🚬','⚰️','🪦','⚱️','🏺','🔮','📿','🧿','🪬',
      '💈','⚗️','🔭','🔬','🕳️','🩻','🩹','🩺','💊','💉',
      '🩸','🧬','🦠','🧫','🧪','🌡️','🧹','🪠','🧺','🧻',
      '🚽','🚰','🚿','🛁','🛀','🧼','🪥','🪒','🧽','🪣',
      '🧴','🛎️','🔑','🗝️','🚪','🪑','🛋️','🛏️','🛌','🧸',
      '🪆','🖼️','🪞','🪟','🛍️','🛒','🎁','🎈','🎏','🎀',
      '🪄','🪅','🎊','🎉','🎎','🏮','🎐','🧧','✉️','📩',
      '📨','📧','💌','📥','📤','📦','🏷️','🪧','📪','📫',
      '📬','📭','📮','📯','📜','📃','📄','📑','🧾','📊',
      '📈','📉','🗒️','🗓️','📆','📅','🗑️','📇','🗃️','🗳️',
      '🗄️','📋','📁','📂','🗂️','🗞️','📰','📓','📔','📒',
      '📕','📗','📘','📙','📚','📖','🔖','🧷','🔗','📎',
      '🖇️','📐','📏','🧮','📌','📍','✂️','🖊️','🖋️','✒️',
      '🖌️','🖍️','📝','✏️','🔍','🔎','🔏','🔐','🔒','🔓',
    ]
  },
  {
    id: 'symbols',
    name: 'Symbols',
    icon: <Hash className="w-4 h-4" />,
    emojis: [
      '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔',
      '❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝',
      '💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️',
      '☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎',
      '♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️',
      '📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮',
      '🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎',
      '🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯',
      '💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗',
      '❕','❓','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸',
      '🔱','⚜️','🔰','♻️','✅','🈯','💹','❇️','✳️','❎',
      '🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿','🅿️','🛗',
      '🈳','🈂️','🛂','🛃','🛄','🛅','🚹','🚺','🚼','⚧️',
      '🚻','🚮','🎦','📶','🈁','🔣','ℹ️','🔤','🔡','🔠',
      '🆖','🆗','🆙','🆒','🆕','🆓','0️⃣','1️⃣','2️⃣','3️⃣',
      '4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','🔢','#️⃣','*️⃣',
      '⏏️','▶️','⏸️','⏯️','⏹️','⏺️','⏭️','⏮️','⏩','⏪',
      '⬆️','↗️','➡️','↘️','⬇️','↙️','⬅️','↖️','↕️','↔️',
      '↩️','↪️','⤴️','⤵️','🔀','🔁','🔂','🔄','🔃','🎵',
      '🎶','➕','➖','➗','✖️','🟰','♾️','💲','💱','™️',
      '©️','®️','〰️','➰','➿','🔚','🔙','🔛','🔝','🔜',
      '✔️','☑️','🔘','🔴','🟠','🟡','🟢','🔵','🟣','⚫',
      '⚪','🟤','🔺','🔻','🔸','🔹','🔶','🔷','🔳','🔲',
      '▪️','▫️','◾','◽','◼️','◻️','🟥','🟧','🟨','🟩',
      '🟦','🟪','⬛','⬜','🟫','🔈','🔇','🔉','🔊','🔔',
      '🔕','📣','📢','👁️‍🗨️','💬','💭','🗯️','♠️','♣️','♥️',
      '♦️','🃏','🎴','🀄','🕐','🕑','🕒','🕓','🕔','🕕',
      '🕖','🕗','🕘','🕙','🕚','🕛',
    ]
  },
  {
    id: 'flags',
    name: 'Flags',
    icon: <Flag className="w-4 h-4" />,
    emojis: [
      '🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🏳️‍⚧️','🏴‍☠️',
      '🇦🇨','🇦🇩','🇦🇪','🇦🇫','🇦🇬','🇦🇮','🇦🇱','🇦🇲',
      '🇦🇴','🇦🇶','🇦🇷','🇦🇸','🇦🇹','🇦🇺','🇦🇼','🇦🇽',
      '🇦🇿','🇧🇦','🇧🇧','🇧🇩','🇧🇪','🇧🇫','🇧🇬','🇧🇭',
      '🇧🇮','🇧🇯','🇧🇱','🇧🇲','🇧🇳','🇧🇴','🇧🇶','🇧🇷',
      '🇧🇸','🇧🇹','🇧🇻','🇧🇼','🇧🇾','🇧🇿','🇨🇦','🇨🇨',
      '🇨🇩','🇨🇫','🇨🇬','🇨🇭','🇨🇮','🇨🇰','🇨🇱','🇨🇲',
      '🇨🇳','🇨🇴','🇨🇵','🇨🇷','🇨🇺','🇨🇻','🇨🇼','🇨🇽',
      '🇨🇾','🇨🇿','🇩🇪','🇩🇬','🇩🇯','🇩🇰','🇩🇲','🇩🇴',
      '🇩🇿','🇪🇦','🇪🇨','🇪🇪','🇪🇬','🇪🇭','🇪🇷','🇪🇸',
      '🇪🇹','🇪🇺','🇫🇮','🇫🇯','🇫🇰','🇫🇲','🇫🇴','🇫🇷',
      '🇬🇦','🇬🇧','🇬🇩','🇬🇪','🇬🇫','🇬🇬','🇬🇭','🇬🇮',
      '🇬🇱','🇬🇲','🇬🇳','🇬🇵','🇬🇶','🇬🇷','🇬🇸','🇬🇹',
      '🇬🇺','🇬🇼','🇬🇾','🇭🇰','🇭🇲','🇭🇳','🇭🇷','🇭🇹',
      '🇭🇺','🇮🇨','🇮🇩','🇮🇪','🇮🇱','🇮🇲','🇮🇳','🇮🇴',
      '🇮🇶','🇮🇷','🇮🇸','🇮🇹','🇯🇪','🇯🇲','🇯🇴','🇯🇵',
      '🇰🇪','🇰🇬','🇰🇭','🇰🇮','🇰🇲','🇰🇳','🇰🇵','🇰🇷',
      '🇰🇼','🇰🇾','🇰🇿','🇱🇦','🇱🇧','🇱🇨','🇱🇮','🇱🇰',
      '🇱🇷','🇱🇸','🇱🇹','🇱🇺','🇱🇻','🇱🇾','🇲🇦','🇲🇨',
      '🇲🇩','🇲🇪','🇲🇫','🇲🇬','🇲🇭','🇲🇰','🇲🇱','🇲🇲',
      '🇲🇳','🇲🇴','🇲🇵','🇲🇶','🇲🇷','🇲🇸','🇲🇹','🇲🇺',
      '🇲🇻','🇲🇼','🇲🇽','🇲🇾','🇲🇿','🇳🇦','🇳🇨','🇳🇪',
      '🇳🇫','🇳🇬','🇳🇮','🇳🇱','🇳🇴','🇳🇵','🇳🇷','🇳🇺',
      '🇳🇿','🇴🇲','🇵🇦','🇵🇪','🇵🇫','🇵🇬','🇵🇭','🇵🇰',
      '🇵🇱','🇵🇲','🇵🇳','🇵🇷','🇵🇸','🇵🇹','🇵🇼','🇵🇾',
      '🇶🇦','🇷🇪','🇷🇴','🇷🇸','🇷🇺','🇷🇼','🇸🇦','🇸🇧',
      '🇸🇨','🇸🇩','🇸🇪','🇸🇬','🇸🇭','🇸🇮','🇸🇯','🇸🇰',
      '🇸🇱','🇸🇲','🇸🇳','🇸🇴','🇸🇷','🇸🇸','🇸🇹','🇸🇻',
      '🇸🇽','🇸🇾','🇸🇿','🇹🇦','🇹🇨','🇹🇩','🇹🇫','🇹🇬',
      '🇹🇭','🇹🇯','🇹🇰','🇹🇱','🇹🇲','🇹🇳','🇹🇴','🇹🇷',
      '🇹🇹','🇹🇻','🇹🇼','🇹🇿','🇺🇦','🇺🇬','🇺🇲','🇺🇳',
      '🇺🇸','🇺🇾','🇺🇿','🇻🇦','🇻🇨','🇻🇪','🇻🇬','🇻🇮',
      '🇻🇳','🇻🇺','🇼🇫','🇼🇸','🇽🇰','🇾🇪','🇾🇹','🇿🇦',
      '🇿🇲','🇿🇼',
    ]
  },
];

// ─── Frequently Used Storage ────────────────────────────────────────────
const FREQ_STORAGE_KEY = 'twemoji-picker-freq';
const MAX_FREQUENT = 24;

function getFrequentEmojis(): string[] {
  try {
    const stored = localStorage.getItem(FREQ_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return ['👍','❤️','😂','🔥','😍','🎉','👏','😢','🤔','💯','✨','🙏'];
}

function addToFrequent(emoji: string) {
  const freq = getFrequentEmojis().filter(e => e !== emoji);
  freq.unshift(emoji);
  try {
    localStorage.setItem(FREQ_STORAGE_KEY, JSON.stringify(freq.slice(0, MAX_FREQUENT)));
  } catch {}
}

// ─── Main Picker Component ──────────────────────────────────────────────
interface TwemojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export const TwemojiPicker = React.memo(({ onSelect, onClose }: TwemojiPickerProps) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('frequent');
  const [frequentEmojis, setFrequentEmojis] = useState<string[]>(getFrequentEmojis);
  const scrollRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Auto-focus search on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Build categories with the dynamic "frequent" section
  const categories = useMemo(() => {
    const cats = [...EMOJI_CATEGORIES];
    cats[0] = { ...cats[0], emojis: frequentEmojis };
    return cats;
  }, [frequentEmojis]);

  // Search filter
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    
    // Flat search across all emojis
    const allEmojis = categories.slice(1).flatMap(c => c.emojis);
    
    // First, check if the query matches a category name
    const categoryMatches = categories.filter(c => c.name.toLowerCase().includes(q));
    if (categoryMatches.length > 0) {
      return categoryMatches;
    }

    // Basic keyword mapping for MNC-grade UX without a 1MB payload
    const keywordMap: Record<string, string[]> = {
      'smile': ['😀','😃','😄','😁','😆','😅','😂','🙂','😊','😇','🥰','😍'],
      'sad': ['😢','😭','😞','😔','😟','😕','🙁','☹️','🥺'],
      'cry': ['😢','😭','😿'],
      'angry': ['😡','😠','🤬','😤'],
      'heart': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','💕','💞','💓','💗','💖','💘','💝'],
      'love': ['❤️','😍','🥰','😘','🫶','💕'],
      'hand': ['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝'],
      'thumbs': ['👍','👎'],
      'fire': ['🔥','💥','⚡'],
      'star': ['⭐','🌟','✨','💫','☄️'],
      'animal': categories.find(c => c.id === 'nature')?.emojis || [],
      'food': categories.find(c => c.id === 'food')?.emojis || [],
      'car': ['🚗','🚕','🚙','🚌','🏎️','🚓','🚑'],
      'flag': categories.find(c => c.id === 'flags')?.emojis || [],
      'rocket': ['🚀'],
      'check': ['✅','✔️','☑️'],
      'cross': ['❌','✖️'],
      'money': ['💰','💸','💵','💶','💷','🪙','🤑'],
      'music': ['🎵','🎶','🎧','🎼','🎹','🥁','🎷','🎺','🎸']
    };

    const matchedEmojis = new Set<string>();
    
    for (const [key, emojis] of Object.entries(keywordMap)) {
      if (key.includes(q) || q.includes(key)) {
        emojis.forEach(e => matchedEmojis.add(e));
      }
    }
    
    if (matchedEmojis.size > 0) {
      return [{ id: 'search', name: `Results for "${search}"`, icon: <Search className="w-4 h-4" />, emojis: Array.from(matchedEmojis) }];
    }

    // Fallback: If nothing matches, show empty
    return [{ id: 'search', name: 'No matches found', icon: <Search className="w-4 h-4" />, emojis: [] }];
  }, [search, categories]);

  // Handle emoji select
  const handleSelect = useCallback((emoji: string) => {
    addToFrequent(emoji);
    setFrequentEmojis(getFrequentEmojis());
    onSelect(emoji);
  }, [onSelect]);

  // Scroll to category
  const scrollToCategory = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setSearch('');
    const el = categoryRefs.current[categoryId];
    if (el && scrollRef.current) {
      const offset = el.offsetTop - scrollRef.current.offsetTop;
      scrollRef.current.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, []);

  // Track which category is visible
  const handleScroll = useCallback(() => {
    if (search) return;
    const container = scrollRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop + 8;
    let current = 'frequent';
    for (const cat of categories) {
      const el = categoryRefs.current[cat.id];
      if (el) {
        const offset = el.offsetTop - container.offsetTop;
        if (scrollTop >= offset) current = cat.id;
      }
    }
    setActiveCategory(current);
  }, [search, categories]);

  return (
    <div
      ref={pickerRef}
      className="w-[352px] h-[420px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {/* ─── Search Header ─── */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emojis..."
            className="w-full pl-8 pr-8 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/40 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ─── Category Tab Bar ─── */}
      {!search && (
        <div className="flex items-center gap-0.5 px-2 pb-1 border-b border-slate-100 dark:border-slate-800">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => scrollToCategory(cat.id)}
              title={cat.name}
              className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer flex-shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* ─── Emoji Grid ─── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-1 scroll-smooth"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}
      >
        {filteredCategories.map(cat => (
          <div
            key={cat.id}
            ref={el => { categoryRefs.current[cat.id] = el; }}
          >
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-1 py-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {cat.name}
              </span>
            </div>
            {cat.emojis.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <span className="text-2xl mb-2">🔍</span>
                <span className="text-xs">No emojis found</span>
              </div>
            ) : (
              <div className="grid grid-cols-8 gap-0.5">
                {cat.emojis.map((emoji, i) => (
                  <button
                    key={`${cat.id}-${emoji}-${i}`}
                    type="button"
                    onClick={() => handleSelect(emoji)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-purple-50 dark:hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all duration-100 cursor-pointer group"
                    title={emoji}
                  >
                    <TwemojiImg emoji={emoji} size={28} />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── Bottom Preview Bar ─── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 min-h-[40px]">
        <TwemojiImg emoji="😊" size={24} />
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          Powered by Twemoji
        </span>
        <span className="text-[10px] text-slate-400 ml-auto">
          {categories.slice(1).reduce((acc, c) => acc + c.emojis.length, 0)}+ emojis
        </span>
      </div>
    </div>
  );
});

TwemojiPicker.displayName = 'TwemojiPicker';

export { TwemojiImg };
