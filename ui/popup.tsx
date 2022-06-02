import React, { useState, useRef } from 'react';
import Input from 'rc-input';
import ReactDOM from 'react-dom';
import './index.css';

const Popup = () => {
	const [currentRule, setCurrentRule] = useState<string[]>([]);
	const [inputRule, setInputRule] = useState<string>('');
	const willMount = useRef(true);
	if (willMount.current) {
		chrome.runtime.sendMessage({ type: 'getCurrentRule' }, response => {
			setCurrentRule(response? response : []);
		});
	}
	willMount.current = false;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputRule(e.target.value);
	};

	const onClick = () => {
		const newRules = [...currentRule, inputRule];
		chrome.runtime.sendMessage({ type: 'updateRule', newRules: newRules }, response => {
			setCurrentRule(response);
		});
		setInputRule('');
	};

	const getOnclick = (rule: string) => {
		const remove= (rulesList: string[], target: string) => {
			return rulesList.filter(item => item !== target)
		}
		return () => {
			console.log('deleting', rule);
			const resultRules = remove(currentRule, rule)
			chrome.runtime.sendMessage({ type: 'updateRule', newRules: resultRules }, response => {
				setCurrentRule(response);
			});
		};
	}
    
	return (
		<div className="w-60 h-72 max-h-80 overflow-auto">
			<h1 className="text-center mt-3 text-xl text-cyan-800">Auto Redirect</h1>
			<h2 className="mx-2 mt-2">Current Rules:</h2>
			<div className="mt-1 bg-slate-200 rounded mx-2 mb-20">
				<ul>
					{currentRule && currentRule.map(rule => (
						<div key={rule} className='flex justify-center py-1'>
							<li className=" text-cyan-600 inline">
								{rule}
							</li>
							<p className="inline absolute right-4">
								<button className='text-gray-600'
									onClick={ getOnclick(rule) }
								>
									⨉
								</button>
							</p>
						</div>
					)
					)}
				</ul>
				<div className="fixed left-6 bottom-6 rounded shadow-md">
					<Input 
						placeholder="New rule"
						className="input p-2 rounded-l"
						value={inputRule}
						onChange={handleChange}
					/>
					<button 
						className=" bg-cyan-700 text-white p-2 rounded-r disabled:bg-slate-400 disabled:hover:cursor-not-allowed"
						onClick={onClick}
						disabled={inputRule === ''}
					>
      			Add
					</button>
				</div>
			</div>
		</div>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
	document.getElementById('root')
);
