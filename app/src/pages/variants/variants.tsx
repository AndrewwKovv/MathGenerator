import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'config';
import { Page } from 'widgets';
import { MathText } from 'shared/components';
import { BlockMath } from 'react-katex';
import { getVariants, getTasksByVariant } from 'shared/api/variantsApi';

import styles from './variants.module.scss';
import { type Task, type Variant } from './types';

export const VariantsPage: FC = () => {
  const navigate = useNavigate();
  const [variants, setVariants] = useState<Variant[]>([]); // Список вариантов
  const [tasks, setTasks] = useState<Task[]>([]); // Список заданий выбранного варианта
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null); // ID выбранного варианта
  const [isAddingVariant, setIsAddingVariant] = useState(false); // Отображение формы добавления варианта

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const data = await getVariants(); // Получаем список вариантов
        setVariants(data);
      } catch (error) {
        console.error('Ошибка при загрузке вариантов:', error);
      }
    };
    void fetchVariants();
  }, []);

  const handleVariantClick = async (variantId: number) => {
    setSelectedVariant(variantId); // Устанавливаем выбранный вариант
    try {
      const data = await getTasksByVariant(variantId); // Получаем задания для выбранного варианта
      setTasks(data); // Устанавливаем задания
    } catch (error) {
      console.error('Ошибка при загрузке заданий:', error);
    }
  };

  return (
    <Page className={styles.wrapper}>
      <h1 className={styles.title}>Мои варианты</h1>
      <div className={styles.scrollContainer}>
        <div
          className={`${styles.card} ${styles.addCard}`}
          role="button"
          tabIndex={0}
          onClick={() => {
            navigate(PATHS.TASKS);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate(PATHS.TASKS);
            }
          }}
        >
          <button type="button" className={styles.addButton}>+</button>
        </div>
        {Array.isArray(variants) && variants.map((variant) => (
          <div
            key={variant.id}
            className={`${styles.card} ${selectedVariant === variant.id && !isAddingVariant ? styles.activeCard : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => {
              void handleVariantClick(variant.id);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                void handleVariantClick(variant.id);
              }
            }}
          >
            <div className={styles.cart__title}>
              <h3>
                {variant?.title || 'Без названия'}
              </h3>
              <p>{variant.topic?.section_name || 'Без темы'}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.divider} />
      <div className={styles.tasksCarousel}>
        {tasks?.map((task) => (
          <div key={task.id} className={styles.taskCard}>
            <p>
              <MathText type="secondary">{task.title || 'Название отсутствует'}</MathText>
            </p>
            <BlockMath>{task.view || 'Содержание отсутствует'}</BlockMath>
          </div>
        ))}
      </div>
    </Page>
  );
};
