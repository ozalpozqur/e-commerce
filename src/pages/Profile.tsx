import { UserCircleIcon } from '@heroicons/react/24/outline';
import { TailSpin } from 'react-loader-spinner';
import { cn } from '../helpers';
import useAuthStore from '../store/auth';
import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import UserService from '../services/UserService';
import Header from '../components/Header';

const subNavigation = [{ name: 'Profile', href: '#', icon: UserCircleIcon, current: true }];

export default function Profile() {
	const { user, setUser } = useAuthStore();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState(user?.name);
	async function onSelectPhoto(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files || !user) return;
		const [file] = e.target.files;
		try {
			setLoading(true);
			const updatedUser = await UserService.updateProfilePicture(user._id, file);
			setUser(updatedUser);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong, please try again.');
		} finally {
			setLoading(false);
		}
	}
	return (
		<>
			<Header />
			<div className="h-full">
				<main className="max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
					<div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
						<aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
							<nav className="space-y-1">
								{subNavigation.map(item => (
									<a
										key={item.name}
										href={item.href}
										className={cn(
											item.current
												? 'bg-gray-50 text-orange-600 hover:bg-white'
												: 'text-gray-900 hover:text-gray-900 hover:bg-gray-50',
											'group rounded-md px-3 py-2 flex items-center text-sm font-medium'
										)}
										aria-current={item.current ? 'page' : undefined}
									>
										<item.icon
											className={cn(
												item.current
													? 'text-orange-500'
													: 'text-gray-400 group-hover:text-gray-500',
												'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
											)}
											aria-hidden="true"
										/>
										<span className="truncate">{item.name}</span>
									</a>
								))}
							</nav>
						</aside>

						<div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
							<section aria-labelledby="payment-details-heading">
								<form className="divide-y divide-gray-200 lg:col-span-9" action="#" method="POST">
									<div className="py-6 px-4 space-y-4 sm:p-6 lg:pb-8">
										<div>
											<h2 className="text-lg leading-6 font-medium text-gray-900">Profile</h2>
											<p className="mt-1 text-sm text-gray-500">
												This information will be displayed publicly so be careful what you
												share.
											</p>
										</div>

										<div className="flex gap-4 flex-col md:flex-row">
											<div className="flex-1">
												<div className="col-span-12 sm:col-span-6">
													<label
														htmlFor="name"
														className="block text-sm font-medium text-gray-700"
													>
														Name
													</label>
													<input
														type="text"
														name="name"
														id="name"
														value={name}
														onChange={e => setName(e.target.value)}
														autoComplete="given-name"
														className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
													/>
												</div>
											</div>
											<div className="flex flex-col lg:flex-row">
												<div className="flex-grow lg:mt-0 lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0">
													<p className="text-sm font-medium text-gray-700" aria-hidden="true">
														Photo
													</p>
													<div className="mt-1 lg:hidden">
														<div className="flex items-center">
															<div
																className="flex-shrink-0 inline-block rounded-full overflow-hidden h-12 w-12"
																aria-hidden="true"
															>
																<img
																	className="rounded-full h-full w-full"
																	src={user?.profilePicture}
																	alt={user?.name}
																/>
															</div>
															<div className="ml-5 rounded-md shadow-sm">
																<div className="group relative border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">
																	<label
																		htmlFor="mobile-user-photo"
																		className="relative text-sm leading-4 font-medium text-gray-700 pointer-events-none"
																	>
																		<span>Change</span>
																		<span className="sr-only"> user photo</span>
																	</label>
																	<input
																		id="mobile-user-photo"
																		name="user-photo"
																		type="file"
																		onChange={onSelectPhoto}
																		className="absolute w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md"
																	/>
																</div>
															</div>
														</div>
													</div>

													<div className="hidden relative rounded-full overflow-hidden lg:block">
														<img
															className="relative rounded-full w-40 h-40"
															src={user?.profilePicture}
															alt={user?.name}
														/>
														<label
															htmlFor="desktop-user-photo"
															className="absolute inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100"
														>
															<span>Change</span>
															<span className="sr-only"> user photo</span>
															<input
																type="file"
																id="desktop-user-photo"
																name="user-photo"
																onChange={onSelectPhoto}
																className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md"
															/>
														</label>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="pt-6">
										<div className="mt-4 py-4 px-4 flex justify-end sm:px-6 gap-5">
											<button
												type="button"
												className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
											>
												Cancel
											</button>
											<button
												type="button"
												disabled={loading}
												className="bg-sky-700 border disabled:cursor-not-allowed relative border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
											>
												Save
												<TailSpin
													wrapperClass="absolute inset-0 flex items-center bg-black/30 justify-center"
													color="#fff"
													ariaLabel="tail-spin-loading"
													height="80%"
													radius="1"
													visible={loading}
												/>
											</button>
										</div>
									</div>
								</form>
							</section>
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
