import {ref, unref} from "vue";

export enum ActionType {
    EDIT,
    CANCEL,
    SAVE,
}

export function useAction(form, formMethods, on = {
    edit: (params: unknown) => {
    }, refresh: () => {
    }
}) {
    const disabled = ref(true);
    const {
        getElFormExpose,
        getFormData,
    } = formMethods;

    async function hander(event) {
        if (event?.type == ActionType.EDIT) {
            disabled.value = false;
        } else if (event?.type == ActionType.CANCEL) {
            disabled.value = true;
        } else if (event?.type == ActionType.SAVE) {
            const elFormExpose = await getElFormExpose()
            elFormExpose?.validate((isValid) => {
                if (isValid) {
                    const params = unref(form);
                    try {
                        let result = on?.edit?.(params);
                        if (result) on?.refresh?.()
                    } catch (err) {

                    } finally {
                        disabled.value = true;
                    }
                }
            })
            const elFormData = await getFormData();
        }
    }


    return {
        hander,
        disabled
    }


}