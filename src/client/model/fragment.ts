export interface Fragment {
  id: number
  content:string
}

export type FragmentInput = Omit<Fragment, 'id'>
