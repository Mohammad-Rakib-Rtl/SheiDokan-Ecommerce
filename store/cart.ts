import { create } from 'zustand';
type CartState={items:number[];wishlist:number[];add:(id:number)=>void;wish:(id:number)=>void};
export const useCart=create<CartState>((set)=>({items:[],wishlist:[],add:(id)=>set(s=>({items:[...s.items,id]})),wish:(id)=>set(s=>({wishlist:s.wishlist.includes(id)?s.wishlist.filter(x=>x!==id):[...s.wishlist,id]}))}));
