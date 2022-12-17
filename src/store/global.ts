import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface GlobalState {
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
}

const useGlobalStore = create<GlobalState>()(
	devtools(
		set => ({
			isSidebarOpen: false,
			toggleSidebar() {
				set(prev => ({ isSidebarOpen: !prev.isSidebarOpen }));
			}
		}),
		{
			name: 'global-storage'
		}
	)
);

export default useGlobalStore;
