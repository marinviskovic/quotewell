// Sample data for Fernway Landscaping (fictional), dated relative to today.
const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const ts = (offset: number, hour = 10) => `${day(offset)}T${String(hour).padStart(2, "0")}:15:00.000Z`;

export const seedLeads = [
  { id: "l01", created_at: ts(-1, 16), name: "Maria Gonzalez", company: null, email: "maria.g@example.com", phone: "(503) 555-0142", service: "Backyard redesign", value: 4800, stage: "new", source: "Website form", follow_up: day(0), notes: "Wants a low-water garden and a small patio. Two dogs." },
  { id: "l02", created_at: ts(-2, 18), name: "Daniel Okafor", company: "Okafor Dental", email: "office@okafordental.example", phone: "(503) 555-0178", service: "Monthly maintenance", value: 650, stage: "contacted", source: "Google", follow_up: day(1), notes: "Office front beds and parking strip, monthly." },
  { id: "l03", created_at: ts(-3, 9), name: "Priya Raman", company: null, email: "priya.raman@example.com", phone: null, service: "Drip irrigation", value: 1200, stage: "quoted", source: "Referral", follow_up: day(0), notes: "Referred by the Hendersons. Sent quote #1043." },
  { id: "l04", created_at: ts(-5, 14), name: "Tom Becker", company: "Becker Property Group", email: "tom@beckerpg.example", phone: "(971) 555-0110", service: "HOA common areas", value: 14500, stage: "quoted", source: "Referral", follow_up: day(2), notes: "Three properties, seasonal contract. Decision at board meeting." },
  { id: "l05", created_at: ts(-6, 11), name: "Aiko Tanaka", company: null, email: "aiko.t@example.com", phone: "(503) 555-0193", service: "Japanese maple planting", value: 900, stage: "won", source: "Instagram", follow_up: null, notes: "Booked for next Thursday." },
  { id: "l06", created_at: ts(-8, 15), name: "Grace Whitfield", company: "Whitfield Cafe", email: "grace@whitfieldcafe.example", phone: "(503) 555-0131", service: "Patio planters", value: 1750, stage: "won", source: "Walk-in", follow_up: null, notes: "Seasonal planter swap, spring and fall." },
  { id: "l07", created_at: ts(-9, 10), name: "Luis Fernandez", company: null, email: "luis.f@example.com", phone: "(971) 555-0157", service: "Lawn to meadow", value: 3200, stage: "contacted", source: "Website form", follow_up: day(-1), notes: "Left voicemail, try again in the morning." },
  { id: "l08", created_at: ts(-11, 13), name: "Hannah Price", company: null, email: "hannah.price@example.com", phone: null, service: "Fence-line hedge", value: 1100, stage: "lost", source: "Google", follow_up: null, notes: "Went with a cheaper quote." },
  { id: "l09", created_at: ts(-12, 9), name: "Sam Whitaker", company: "Whitaker Builders", email: "sam@whitakerbuilders.example", phone: "(503) 555-0166", service: "New-build landscaping", value: 22000, stage: "contacted", source: "Referral", follow_up: day(3), notes: "Four new homes in Sellwood, needs plans by month end." },
  { id: "l10", created_at: ts(-14, 17), name: "Olivia Chen", company: null, email: "olivia.chen@example.com", phone: "(503) 555-0105", service: "Raised vegetable beds", value: 2400, stage: "won", source: "Instagram", follow_up: null, notes: "Cedar beds, 4 x 8 ft, three of them." },
  { id: "l11", created_at: ts(-16, 12), name: "Marcus Hill", company: null, email: "marcus.hill@example.com", phone: null, service: "Tree removal", value: 1800, stage: "new", source: "Website form", follow_up: day(1), notes: "Dead fir near the garage." },
  { id: "l12", created_at: ts(-20, 10), name: "Elena Novak", company: "Novak Law", email: "elena@novaklaw.example", phone: "(971) 555-0124", service: "Office courtyard", value: 5600, stage: "quoted", source: "Google", follow_up: day(-2), notes: "Waiting on their partner meeting." },
];

export const seedActivities = [
  { id: "a01", lead_id: "l03", body: "Site visit done. Measured four beds.", created_at: ts(-3, 11) },
  { id: "a02", lead_id: "l03", body: "Sent quote #1043 for $1,200.", created_at: ts(-2, 15) },
  { id: "a03", lead_id: "l04", body: "Walked the properties with Tom.", created_at: ts(-4, 10) },
  { id: "a04", lead_id: "l01", body: "Lead came in from the website form.", created_at: ts(-1, 16) },
  { id: "a05", lead_id: "l09", body: "Intro call, sending a draft plan.", created_at: ts(-10, 14) },
];
