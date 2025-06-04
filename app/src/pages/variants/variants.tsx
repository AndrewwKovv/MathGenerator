import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, message } from 'antd';
import { PATHS } from 'config';
import { Page } from 'widgets';
import { MathText } from 'shared/components';
import { BlockMath } from 'react-katex';
import { getVariants, getTasksByVariant, deleteVariant } from 'shared/api/variantsApi';

import styles from './variants.module.scss';
import { type Task, type Variant } from './types';

export const VariantsPage: FC = () => {
  const navigate = useNavigate();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  useEffect(() => {
    void fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      const data = await getVariants();
      setVariants(data);
    } catch (error) {
      console.error('Ошибка при загрузке вариантов:', error);
    }
  };

  const handleVariantClick = async (variantId: number) => {
    setSelectedVariant(variantId);
    try {
      const data = await getTasksByVariant(variantId);
      setTasks(data);
    } catch (error) {
      console.error('Ошибка при загрузке заданий:', error);
    }
  };

  const handleDeleteVariant = (variantId: number) => {
    Modal.confirm({
      title: 'Удаление варианта',
      content: 'Вы уверены, что хотите удалить этот вариант?',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteVariant(variantId);
          void message.success('Вариант удалён');
          await fetchVariants();
          if (selectedVariant === variantId) {
            setTasks([]);
            setSelectedVariant(null);
          }
        } catch (error) {
          console.error('Ошибка при удалении варианта:', error);
          void message.error('Не удалось удалить вариант');
        }
      }
    });
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
            onDoubleClick={() => {
              handleDeleteVariant(variant.id);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                void handleVariantClick(variant.id);
              }
            }}
          >
            <div className={styles.cart__title}>
              <h4>{variant?.title || 'Без названия'}</h4>
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
