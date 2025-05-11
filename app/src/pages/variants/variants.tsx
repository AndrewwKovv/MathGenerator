import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'antd';
import { PATHS } from 'config';
import { Page } from 'widgets';
import { Button } from 'shared/components';
import { getVariants, getTasksByVariant } from 'shared/api/variantsApi';

import styles from './variants.module.scss';
import { type Task, type Variant } from './types';

export const VariantsPage: FC = () => {
  const navigate = useNavigate();
  const [variants, setVariants] = useState<Variant[]>([]); // Список вариантов
  const [tasks, setTasks] = useState<Task[]>([]); // Список заданий выбранного варианта
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null); // ID выбранного варианта

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
      <Carousel className={styles.carousel} dots={false} slidesToShow={4}>
        <div
          className={styles.card}
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
        {variants.map((variant) => (
          <div
            key={variant.id}
            className={styles.card}
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
            <h3>Вариант №</h3>
            <p>{variant.title}</p>
            <p>{variant.code}</p>
          </div>
        ))}
      </Carousel>
      <div className={styles.divider} />
      <Carousel className={styles.tasksCarousel} vertical dots={false}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.taskCard}>
            <h3>{task.title}</h3>
            <p>{task.data_task}</p>
          </div>
        ))}
      </Carousel>
    </Page>
  );
};
