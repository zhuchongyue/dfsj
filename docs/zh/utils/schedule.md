# NodeScheduleMission
> 定时任务类
```ts
export declare namespace Mission {
	export declare interface Mission {
		schedules(missions: Mission.Config[]): Mission.Job[]

		uninstall(jobs: Mission.Job[]): void
	}

	export declare type Config = {
		id: string
		disabled?: boolean
		immediate?: boolean
		trigger?: string
		execute: (start: number, store: any) => any
	}

	export declare type Job = any
}


let schedule = new NodeScheduleMission('common')
```