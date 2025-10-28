export type ServiceScreenName = 'pulsa' | 'pln' | 'game' | 'ewallet' | 'streaming' | 'donate' | 'insurance' | 'more';


export const SERVICE_PATHS: Record<ServiceScreenName, string> = {
  pulsa: '/services/pulsa',
  pln: '/services/pln',
  game: '/services/game',
  ewallet: '/services/ewallet',
  streaming: '/services/streaming',
  donate: '/services/donate',
  insurance: '/services/insurance',
  more: '/services/more',
};