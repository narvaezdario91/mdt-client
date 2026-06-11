import { Payload } from '../models/payload.schema';

export class CacheReplay {
  /**
   * Inyecta el estado de ejecución de la caché en el nuevo payload.
   * La inyección se hace a nivel de instrucción y se detiene en la primera divergencia.
   */
  public static inject(payload: Payload, cachedData: any): Payload {
    if (!cachedData || (!cachedData.steps && !(cachedData.cache_content && cachedData.cache_content.steps))) {
      console.warn('⚠️ Cache data is invalid or missing steps. Skipping replay.');
      return payload;
    }

    // La API a veces devuelve la raíz como cache_content y a veces directo
    const cachedSteps = cachedData.steps || cachedData.cache_content.steps;
    const newSteps = payload.cache_content.steps;

    let canInject = true;
    let injectedCount = 0;

    for (let i = 0; i < newSteps.length; i++) {
      if (!canInject) break;

      const newStep = newSteps[i];
      const cachedStep = cachedSteps[i];

      // Divergencia a nivel de Step Gherkin
      if (!cachedStep || newStep.stepText !== cachedStep.stepText) {
        canInject = false;
        break; 
      }

      for (let j = 0; j < newStep.instructions.length; j++) {
        const newInst = newStep.instructions[j];
        const cachedInst = cachedStep.instructions[j];

        // Divergencia a nivel de Instrucción yaml
        if (!canInject || !cachedInst || newInst.instruction !== cachedInst.instruction) {
          canInject = false;
          break;
        }

        // Si la instrucción de la caché fue exitosa, inyectamos la instrucción completa
        // Esto preserva tanto el bloque 'execution' como cualquier propiedad 'actions'
        // (por ejemplo, acciones de playwright o selenium generadas por la API).
        if (cachedInst.execution && cachedInst.execution.status === 'success') {
          newStep.instructions[j] = cachedInst;
          injectedCount++;
        } else {
          // Si falló o no tiene ejecución, detenemos la inyección a partir de aquí
          canInject = false;
          break;
        }
      }
    }

    if (injectedCount > 0) {
      console.log(`♻️  Cache Replay: Injected ${injectedCount} successful instruction(s) from Golden Copy.`);
    }

    return payload;
  }
}
