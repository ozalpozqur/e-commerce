import { FaSearch } from 'react-icons/all';
import Button from './ui/Button';
import { useEffect, useRef, useState } from 'react';
import { OrderService } from '../services';
import { motion, AnimatePresence } from 'framer-motion';
import Input from './ui/Input';
import { Order } from '../types/altogic';
import { Link } from 'react-router-dom';
let timeout: number;

export default function SearchOrder() {
	const [open, setOpen] = useState(false);
	const [result, setResult] = useState<Order[]>([]);
	const input = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open) input.current?.focus();
		else {
			input.current?.blur();
			setResult([]);
		}
	}, [open]);

	function onChangeHandler() {
		if (!input.current) return;
		const value = input.current?.value;
		clearTimeout(timeout);
		if (value.trim().length === 0) return setResult([]);
		timeout = window.setTimeout(() => search(value), 500);
	}

	async function search(query: string) {
		const result = await OrderService.searchOrder(query);
		setResult(result);
	}

	return (
		<div className="flex items-center gap-3 h-12 w-full">
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{
							translateX: '100%',
							scale: 0,
							opacity: 0
						}}
						animate={{
							translateX: '0',
							scale: 1,
							opacity: 1
						}}
						exit={{
							translateX: '100%',
							scale: 0,
							opacity: 0
						}}
						transition={{ type: 'tween' }}
						className="flex-1"
					>
						<div className="relative group">
							<Input
								onChange={onChangeHandler}
								ref={input}
								className="py-2.5"
								placeholder="Type customer name or email or order code"
							/>
							<AnimatePresence>
								{result.length > 0 && (
									<motion.div
										initial={{ y: -1, opacity: 0 }}
										animate={{ y: 5, opacity: 1 }}
										exit={{ y: -1, opacity: 0 }}
										transition={{ type: 'spring' }}
										className="hidden group-focus-within:block origin-top-left shadow min-h-[30px] absolute bg-white top-full rounded py-2 left-0 right-0 border"
									>
										<ul className="grid gap-1">
											{result.map(order => (
												<li
													key={order._id}
													className="hover:bg-gray-100 transition h-[30px] relative"
												>
													<Link
														className="block absolute inset-0 flex items-center px-2 gap-1"
														to={`/admin/orders/${order._id}?orderNumber=${order.orderNumber}`}
													>
														<strong>
															#{order.orderNumber.toString().padStart(6, '0')}
														</strong>
														<span>-</span>
														<span>{order.user.name}</span>
													</Link>
												</li>
											))}
										</ul>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<Button onClick={() => setOpen(!open)} variant="white" className="gap-2 ml-auto whitespace-nowrap shrink-0">
				<FaSearch /> Search order
			</Button>
		</div>
	);
}
